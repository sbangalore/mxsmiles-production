import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { Request } from 'express';

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload file to S3
export async function uploadToS3(
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<string> {
  const key = `${folder}/${Date.now()}-${file.originalname}`;
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read' as const,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}

// Generate presigned URL for direct upload from frontend
export async function generatePresignedUrl(
  fileName: string,
  fileType: string,
  folder: string = 'uploads'
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const key = `${folder}/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read',
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    
    return { uploadUrl, fileUrl };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}