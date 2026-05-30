const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const stamp = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${stamp}${ext}`);
  },
});

function imageFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    files: 6,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { upload };