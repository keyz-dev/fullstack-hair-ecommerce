require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { BadRequestError } = require('../utils/errors');

const inProduction = process.env.NODE_ENV === 'production';

// --- Helpers ---
// Ensure upload directories exist (only for development)
function createUploadDirs() {
  if (inProduction) return;
  const dirs = ['uploads', 'uploads/avatars', 'uploads/products', 'uploads/categories'];
  dirs.forEach((dir) => {
    const dirPath = path.join(process.cwd(), 'src', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Determine subdirectory based on file fieldname
function getUploadSubDir(fieldname) {
  switch (fieldname) {
    case 'avatar': return 'avatars';
    case 'productImage':
    case 'productImages': return 'products';
    case 'categoryImage': return 'categories';
    default: return 'others';
  }
}

// Helper for Cloudinary folder
function getCloudinaryFolder(fieldname) {
  return getUploadSubDir(fieldname) || 'misc';
}

// --- Initialization ---
createUploadDirs();

// --- Multer Storage Config ---
const storage = inProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const subDir = getUploadSubDir(file.fieldname);
        file.folderName = subDir;
        const uploadDir = path.join(__dirname, '../uploads', subDir);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
      },
    });

// --- File Filter ---
const fileFilter = (req, file, cb) => {
  console.log("\n------------------")
  console.log("The multer middle ware has been accessed:", req.body)
  console.log(req.files)
  console.log("\n------------------")

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/)) {
    return cb(new BadRequestError('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// --- Multer Instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- Middleware: Cloudinary Upload (production) ---
const handleCloudinaryUpload = async (req, res, next) => {
  if (!inProduction) return next();
  try {
    if (!req.file && !req.files) return next();
    if (req.file) {
      const folderName = getCloudinaryFolder(req.file.fieldname);
      req.file.folderName = folderName;
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: folderName,
        resource_type: 'auto',
      });
      req.file.path = result.secure_url;
    } else if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const folderName = getCloudinaryFolder(file.fieldname);
        file.folderName = folderName;
        return uploadToCloudinary(file.buffer, {
          folder: folderName,
          resource_type: 'auto',
        });
      });
      const results = await Promise.all(uploadPromises);
      req.files = results.map((result, index) => ({
        ...result,
        path: result.secure_url,
        folderName: req.files[index].folderName,
      }));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// --- Middleware: Format File Paths for Response ---
const formatFilePaths = (req, res, next) => {
  if (req.file) {
    if (!inProduction) {
      req.file.path = `/uploads/${req.file.folderName}/${path.basename(req.file.path)}`;
    }
  }
  if (req.files && Object.keys(req.files).length > 0) {
    Object.keys(req.files).forEach((key) => {
      if (Array.isArray(req.files[key])) {
        req.files[key] = req.files[key].map((file) => {
          if (!inProduction) {
            file.path = `/uploads/${file.folderName}/${path.basename(file.path)}`;
          }
          file.path = file.path.replace(/\\/g, '/');
          return file;
        });
      } else {
        req.files[key].path = `/uploads/${req.files[key].folderName}/${path.basename(req.files[key].path)}`;
      }
    });
  }
  next();
};

// --- Middleware: Handle Multer Errors ---
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File size too large. Maximum size is 5MB.'));
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

// --- Exports ---
module.exports = {
  upload,
  handleCloudinaryUpload,
  handleUploadError,
  formatFilePaths,
};
