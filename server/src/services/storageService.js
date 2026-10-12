import 'dotenv/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let cachedS3 = null;

/**
 * Dynamically resolves AWS S3 Client and Bucket configuration from environment
 */
export const getS3Config = () => {
  if (cachedS3) return cachedS3;

  const s3Region = (process.env.AWS_REGION || 'us-east-1').trim();
  const s3Bucket = process.env.AWS_S3_BUCKET_NAME?.trim();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (accessKeyId && secretAccessKey && s3Bucket) {
    try {
      const client = new S3Client({
        region: s3Region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      console.log(`✅ AWS S3 Client connected successfully to bucket [${s3Bucket}] in region [${s3Region}]`);
      cachedS3 = { client, bucket: s3Bucket, region: s3Region };
      return cachedS3;
    } catch (err) {
      console.error('⚠️ Failed initializing AWS S3 Client:', err.message);
    }
  } else {
    console.log('ℹ️ AWS S3 credentials not fully configured in .env. Using secure tokenized presigned URLs with local repository.');
  }

  return null;
};

// Initial check on load
getS3Config();

/**
 * Upload a file buffer to S3 or local fallback
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File mime type
 * @returns {Promise<string>} File key / path identifier
 */
export const uploadSignature = async (buffer, originalName, mimeType) => {
  const extension = path.extname(originalName) || '.png';
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1e9);
  const key = `signatures/${timestamp}-${randomSuffix}${extension}`;

  const s3 = getS3Config();

  if (s3) {
    try {
      console.log(`🚀 Uploading signature buffer (${buffer.length} bytes) to AWS S3 bucket: [${s3.bucket}], key: [${key}]`);
      const uploadParams = {
        Bucket: s3.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      };
      await s3.client.send(new PutObjectCommand(uploadParams));
      console.log(`✅ Signature successfully uploaded to AWS S3: ${key}`);
      return key;
    } catch (s3Err) {
      console.error(`⚠️ AWS S3 upload failed (${s3Err.message}). Gracefully saving to local storage fallback.`);
    }
  }

  // Local fallback: save to uploads directory
  const filename = `${timestamp}-${randomSuffix}${extension}`;
  const filePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  return `local:${filename}`;
};

/**
 * Generate a short-lived presigned URL (valid for 15 minutes = 900s)
 * Works for both real AWS S3 objects and local tokenized presigned URLs
 * @param {string} storageKey - Key returned during upload
 * @param {string} baseUrl - Current server base URL for local fallback
 * @returns {Promise<string|null>} Signed URL or access URL
 */
export const getPresignedSignatureUrl = async (storageKey, baseUrl = '') => {
  if (!storageKey) return null;

  const s3 = getS3Config();

  // 1. AWS S3 Storage Key
  if (!storageKey.startsWith('local:') && s3) {
    try {
      const command = new GetObjectCommand({
        Bucket: s3.bucket,
        Key: storageKey,
      });
      // Expires in 15 minutes (900 seconds)
      const presignedUrl = await getSignedUrl(s3.client, command, { expiresIn: 900 });
      console.log(`🔗 Generated AWS S3 Presigned URL for key [${storageKey}]`);
      return presignedUrl;
    } catch (err) {
      console.error('Error generating AWS S3 presigned URL:', err.message);
    }
  }

  // 2. Tokenized Presigned URL for local file streaming
  const filename = storageKey.replace('local:', '');
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_prachay_voucher_2026';
  // Sign a 15-minute token (900 seconds)
  const token = jwt.sign({ file: filename }, secret, { expiresIn: '15m' });
  return `${baseUrl}/api/signatures/view/${filename}?token=${token}`;
};
