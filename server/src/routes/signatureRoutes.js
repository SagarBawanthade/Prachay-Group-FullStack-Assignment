import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

const router = express.Router();

// Protected endpoint to stream signature image securely via presigned token or Bearer header
router.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const token = req.query.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Presigned token required.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_prachay_voucher_2026';
    const decoded = jwt.verify(token, secret);
    // If token was minted specifically for a file, enforce it
    if (decoded.file && decoded.file !== filename) {
      return res.status(403).json({ success: false, message: 'Invalid presigned asset token.' });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Presigned signature access link has expired.' });
  }

  // Prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadsDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Signature file not found on disk.' });
  }

  // Set appropriate content type based on extension or SVG header
  const ext = path.extname(safeFilename).toLowerCase();
  let contentType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.svg') contentType = 'image/svg+xml';

  try {
    const headBuffer = Buffer.alloc(100);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, headBuffer, 0, 100, 0);
    fs.closeSync(fd);
    const headText = headBuffer.toString('utf8');
    if (headText.includes('<svg') || headText.includes('<?xml')) {
      contentType = 'image/svg+xml';
    }
  } catch (err) {
    // default to content-type by extension
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, max-age=900'); // 15 mins cache
  return fs.createReadStream(filePath).pipe(res);
});

export default router;
