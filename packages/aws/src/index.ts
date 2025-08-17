import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";

// Content-Type mapping for common web files
const contentTypeMap: { [ext: string]: string } = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return contentTypeMap[ext] || "application/octet-stream";
}

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
            Key: `${process.env.S3_ARTIFACT_PATH_PREFIX ? process.env.S3_ARTIFACT_PATH_PREFIX + "/" : ""}${folderPrefix}/${s3Key}`,
            Body: fileBuffer,
            ContentType: getContentType(entry.name),
          }),
        );
        console.log(`Uploaded: ${s3Key}`);
      }
    }
  }

  await traverseAndUpload(localDirPath, "");

  return `${process.env.S3_ARTIFACT_PATH_PREFIX ? process.env.S3_ARTIFACT_PATH_PREFIX + "/" : ""}${folderPrefix}`; // folder where the static files are sotred
};

export const getFileFromS3 = async (key: string, localFilePath: string) => {
  const s3Client = init();
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  const response = await s3Client.send(command);

  const localDir = path.dirname(localFilePath);

  // Create directory structure recursively if it doesn't exist
  if (!existsSync(localDir)) {
    mkdirSync(localDir, { recursive: true });
  }

  // Stream the S3 object to local file
  const writeStream = createWriteStream(localFilePath);

  try {
    // Use pipeline for better error handling and memory efficiency
    await pipeline(response.Body as NodeJS.ReadableStream, writeStream);
    console.log(`File downloaded and saved to: ${localFilePath}`);
    return localFilePath;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
