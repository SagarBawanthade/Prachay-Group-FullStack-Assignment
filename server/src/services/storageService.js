import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// AWS S3 client configuration
const s3Region = process.env.AWS_REGION || 'us-east-1';
const s3Bucket = process.env.AWS_S3_BUCKET_NAME;
const hasAwsCredentials = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME
);

let s3Client = null;
if (hasAwsCredentials) {
  s3Client = new S3Client({
    region: s3Region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  console.log('✅ AWS S3 Client initialized successfully');
} else {
  console.log('ℹ️ AWS S3 credentials not fully configured. Using secure local file fallback with tokenized presigned URLs.');
}

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

  if (s3Client && s3Bucket) {
    const uploadParams = {
      Bucket: s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    return key;
  }

  // Local fallback: save to uploads directory
  const filePath = path.join(uploadsDir, `${timestamp}-${randomSuffix}${extension}`);
  await fs.promises.writeFile(filePath, buffer);
  return `local:${timestamp}-${randomSuffix}${extension}`;
};

/**
 * Generate a short-lived presigned URL (valid for 15 minutes = 900s)
 * @param {string} storageKey - Key returned during upload
 * @param {string} baseUrl - Current server base URL for local fallback
 * @returns {Promise<string|null>} Signed URL or access URL
 */
export const getPresignedSignatureUrl = async (storageKey, baseUrl = '') => {
  if (!storageKey) return null;

  if (storageKey.startsWith('local:')) {
    const filename = storageKey.replace('local:', '');
    return `${baseUrl}/api/signatures/view/${filename}`;
  }

  if (s3Client && s3Bucket) {
    try {
      const command = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: storageKey,
      });
      // Expires in 15 minutes (900 seconds)
      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
      return presignedUrl;
    } catch (err) {
      console.error('Error generating presigned S3 URL:', err);
      return null;
    }
  }

  return null;
};
