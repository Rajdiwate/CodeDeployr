import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY",
  },
});

export const uploadZipToS3 = async (localPath: string, fileName: string) => {
  try {
    console.log("envs", [
      process.env.S3_BUCKET,
      process.env.S3_ZIP_PATH_PREFIX,
      process.env.AWS_REGION,
    ]);

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
    return publicUrl;
  } catch (error) {
    console.error("Error uploading zip to S3", error);
  }
};

export const uploadFilesFromLocalDirectoryToS3 = () => {};
