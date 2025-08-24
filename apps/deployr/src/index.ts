import { config } from "dotenv";
import { Kafka } from "kafkajs";
import { createDeployment, getProject } from "./utils/dbOpt";
import { client } from "@deployr/db";
import { getFileFromS3, uploadFilesFromLocalDirectoryToS3 } from "@deployr/aws";
import AdmZip from "adm-zip";
import path from "path";
import { rm, rmdir } from "fs/promises";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

config();

const kafka = new Kafka({
  clientId: "deployr",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "deployr",
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_DEPLOY_TOPIC || "deploy-request",
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;
      console.log(JSON.parse(message.value.toString()));
      const projectId = JSON.parse(message.value.toString())
        .projectId as string;
      // get the project from db
      const project = await getProject(projectId);
      // create a deployment
      const deployment = await createDeployment({
        branch: project?.githubBranch as string,
        projectId,
      });
      if (!deployment) {
        console.log("failed to create deployment");
        // should try again after some time. Another service should check which projects has not been deployed and try to deploy them
        return;
      }
      // check if the project type is static or frontend
      // if the project type is static  ,then take the build artifact path , search for it on s3 , get the path of index.html from there , create url and return
      if (project?.framework === "STATIC_HTML") {
        const publicUrl = `http://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${project.buildArtifactsPath}/index.html`;
        console.log(publicUrl);
        // update the project with the deployment url and deployment status to deployed
        await client.deployment.update({
          where: { id: deployment.id },
          data: {
            status: "DEPLOYED",
            deploymentUrl: publicUrl,
          },
        });

        // Commit offset after successful processing
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
      }

      if (project?.framework === "REACT") {
        if (!project.sourceCodePath) {
          console.log("no zip path provided");
          if (deployment) {
            await client.deployment.update({
              where: { id: deployment.id },
              data: { status: "FAILED" },
            });
          }

          return;
        }

        try {
          // Create local file path: __dirname + key
          const localFilePath = path.join(__dirname, project.sourceCodePath);
          // get zip file from s3
          await getFileFromS3(project.sourceCodePath, localFilePath);
          // unzip to "projectId" folder
          const zip = new AdmZip(
            path.join(__dirname, `${project.sourceCodePath}`),
          );
          zip.extractAllTo(path.join(__dirname, `${projectId}`), true);
          //delete the zipped file from local
          rm(path.join(__dirname, `${project.sourceCodePath}`));
          // TODO ===> update the deployment status with building

          //Add homepage : "build/deploymentId" to package.json
          const packageJson = JSON.parse(
            readFileSync(
              path.join(__dirname, `${projectId}/package.json`),
              "utf-8",
            ),
          );
          // Update homepage
          packageJson.homepage = `/build/${deployment.id}`;
          writeFileSync(
            path.join(__dirname, `${projectId}/package.json`),
            JSON.stringify(packageJson, null, 2),
          );

          //run the install and build in the docker image with the volume mount of the ${projectId} folder
          const CMD = `docker run --rm -v ${path.join(
            __dirname,
            `${projectId}`,
          )}:/app/${projectId} rajd0311/node-isolation:1 sh -c "cd /app/${projectId} && npm install && ${project.buildCommand}"`; // run the build command of the project

          const result = execSync(CMD);
          console.log(result);

          let artifictPath = "";
          // for CRA
          if (existsSync(path.join(__dirname, `${projectId}/build`))) {
            artifictPath = await uploadFilesFromLocalDirectoryToS3(
              path.join(__dirname, `${projectId}/build`),
              projectId,
            );
          }
          // for Vite
          else if (existsSync(path.join(__dirname, `${projectId}/dist`))) {
            artifictPath = await uploadFilesFromLocalDirectoryToS3(
              path.join(__dirname, `${projectId}/build`),
              projectId,
            );
          }

          await rmdir(path.join(__dirname, `${projectId}`), {
            recursive: true,
          });

          console.log("artifactPath", artifictPath);
          // update the project to store the new artifcat path
          // update the deployment url
          await client.deployment.update({
            where: { id: deployment.id },
            data: {
              status: "DEPLOYED",
              deploymentUrl: `http://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${artifictPath}/index.html`,
            },
          });

          // delete the zip file from s3
        } catch (error) {
          console.log("something went wrong while deploying", error);
          // Decide whether to commit on error or let it retry
          // For now, commit to avoid infinite retries
          // await consumer.commitOffsets([
          //   {
          //     topic,
          //     partition,
          //     offset: (parseInt(message.offset) + 1).toString(),
          //   },
          // ]);
          if (deployment) {
            await client.deployment.update({
              where: { id: deployment.id },
              data: { status: "FAILED" },
            });
          }
        }
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
      }
    },
  });
};

run().then(() => {
  console.log("Deployr Started");
});
