const multer = require('multer');

const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB — generous enough for short property videos
    files: 20,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type.'));
    }
    return cb(null, true);
  },
});

module.exports = upload;
