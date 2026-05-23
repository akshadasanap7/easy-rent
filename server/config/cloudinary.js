const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    stream.end(buffer);
  });

module.exports = { upload, uploadToCloudinary };
