import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

const router = express.Router();

// Protected endpoint to stream signature image securely
router.get('/view/:filename', authenticate, (req, res) => {
  const filename = req.params.filename;
  // Prevent directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadsDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Signature file not found' });
  }

  // Set appropriate content type based on extension
  const ext = path.extname(safeFilename).toLowerCase();
  let contentType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.webp') contentType = 'image/webp';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'private, max-age=900'); // 15 mins cache
  return fs.createReadStream(filePath).pipe(res);
});

export default router;
