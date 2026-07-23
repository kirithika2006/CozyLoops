const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories
const videoDir = path.join(uploadDir, 'videos');
const imageDir = path.join(uploadDir, 'images');
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads';
    
    // Determine folder based on field name or mimetype
    if (file.fieldname === 'video' || (file.mimetype && file.mimetype.startsWith('video/'))) {
      folder = 'uploads/videos';
    } else if (file.fieldname === 'thumbnail' || file.fieldname === 'image' || file.fieldname === 'images') {
      folder = 'uploads/images';
    }
    
    const fullPath = path.join(__dirname, '../../', folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

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