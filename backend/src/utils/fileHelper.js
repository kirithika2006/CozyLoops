const fs = require('fs');
const path = require('path');

// Get file URL for local uploads
const getFileUrl = (filename, folder = '') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const uploadPath = '/uploads';
  const folderPath = folder ? `/${folder}` : '';
  return `${baseUrl}${uploadPath}${folderPath}/${filename}`;
};

// Delete file from local storage
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Delete multiple files
const deleteFiles = (filePaths) => {
  return filePaths.map(path => deleteFile(path));
};

// Get file path from URL
const getFilePathFromUrl = (url) => {
  // Remove base URL to get relative path
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const relativePath = url.replace(baseUrl, '');
  return path.join(__dirname, '../../', relativePath);
};

module.exports = {
  getFileUrl,
  deleteFile,
  deleteFiles,
  getFilePathFromUrl
};