import { config } from "dotenv";
import { Kafka } from "kafkajs";
import { createDeployment, getProject } from "./utils/dbOpt";
import { client } from "@deployr/db";
import { getFileFromS3 } from "@deployr/aws";
import AdmZip from "adm-zip";
import path from "path";
import { rm } from "fs/promises";

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
    eachMessage: async ({ message }) => {
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
      }

      if (project?.framework === "REACT") {
        if (!project.sourceCodePath) {
          console.log("no zip path provided");
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
          rm(path.join(__dirname, `${project.sourceCodePath}`));
        } catch (error) {
          console.log("error while getting file from s3", error);
        }
      }
    },
  });
};

run().then(() => {
  console.log("Deployr Started");
});
