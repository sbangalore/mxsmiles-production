import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Upload file to S3
export async function uploadToS3(file: Express.Multer.File, key: string): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials are not configured');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private', // Keep files private for security
  });

  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}

// Generate presigned URL for secure access to private files
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

// Middleware for handling single file upload
export const singleUpload = upload.single('photo');

// Middleware for handling photo upload to consultation form
export const handlePhotoUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
    const key = `consultation-photos/${timestamp}-${randomId}.${fileExtension}`;

    // Upload to S3
    const photoUrl = await uploadToS3(req.file, key);
    
    // Add photoUrl to request body
    req.body.photoUrl = photoUrl;
    
    next();
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload photo' 
    });
  }
};

export { upload };