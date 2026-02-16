import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

// Load .env file
dotenv.config();


const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.access_key!,
    secretAccessKey: process.env.secret_key!,
  },
});

const uploadFile = async (fileName: string, fileType: string) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "aws-s3-store-management",
      Key: `Chat/${fileName}`,
      ContentType: fileType,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { success: true, data: url };
  } catch (error) {
    return { success: false, data: null };
  }
};

export default uploadFile;
