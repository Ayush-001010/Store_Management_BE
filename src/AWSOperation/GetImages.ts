import { S3Client  , GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

//console.log("Access Key:", process.env.access_key);
//console.log("Secret Key:", process.env.secret_key);
 
const s3Client = new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: process.env.access_key!,
        secretAccessKey: process.env.secret_key!,
    },
});

const getImages = async (key: string) => {
    try{
        const command = new GetObjectCommand({
            Bucket: "aws-s3-store-management",
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return {success : true , data : url};
    } catch(error){
        console.error("Error generating signed URL:", error);
    }
};

export default getImages;