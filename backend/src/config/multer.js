const multer = require('multer');
const path = require('path');

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
  
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only images and videos are allowed. Received: ${file.mimetype}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: fileFilter
});

// Configure for multiple image uploads
const uploadImages = upload.array('images', 10);

// Configure for single image upload
const uploadImage = upload.single('image');

// Configure for video upload
const uploadVideo = upload.single('video');

// Configure for mixed upload (images + video)
const uploadMixed = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

module.exports = {
  upload,
  uploadImages,
  uploadImage,
  uploadVideo,
  uploadMixed
};