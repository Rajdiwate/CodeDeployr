import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";

const init = () => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY",
    },
  });

  return s3Client;
};

export const uploadZipToS3 = async (localPath: string, fileName: string) => {
  try {
    const s3Client = init();

    const fileBuffer = await fs.readFile(localPath);
    const data = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${process.env.S3_ZIP_PATH_PREFIX}/${fileName}.zip`,
        Body: fileBuffer,
        ContentType: "application/zip",
      }),
    );
    console.log(`Uploaded ${fileName} to ${process.env.S3_BUCKET}`);
    const key = `${process.env.S3_ZIP_PATH_PREFIX}/${fileName}.zip`;
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log(publicUrl);
    return key;
  } catch (error) {
    console.error("Error uploading zip to S3", error);
  }
};

export const uploadFilesFromLocalDirectoryToS3 = async (
  localDirPath: string,
  folderPrefix: string,
) => {
  const s3Client = init();
  async function traverseAndUpload(currentFolder: string, prefix: string) {
    const entries = await fs.readdir(currentFolder, { withFileTypes: true });

    for (const entry of entries) {
      const localPath = path.join(currentFolder, entry.name);
      const s3Key = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Recurse into subfolder
        await traverseAndUpload(localPath, s3Key);
      } else {
        // It's a file → upload it
        const fileBuffer = await fs.readFile(localPath);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: `${process.env.S3_ARTIFACT_PATH_PREFIX ? process.env.S3_ARTIFACT_PATH_PREFIX + "/" : ""}${folderPrefix} /${s3Key}`,
            Body: fileBuffer,
          }),
        );
        console.log(`Uploaded: ${s3Key}`);
      }
    }
  }

  await traverseAndUpload(localDirPath, "");

  return `${process.env.S3_ARTIFACT_PATH_PREFIX ? process.env.S3_ARTIFACT_PATH_PREFIX + "/" : ""}${folderPrefix}`; // folder where the static files are sotred
};
