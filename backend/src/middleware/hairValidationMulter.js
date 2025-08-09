const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { BadRequestError } = require("../utils/errors");

// Create temporary directory for hair validation
const tempDir = path.join(
  process.cwd(),
  "src",
  "uploads",
  "temp",
  "hair_validation"
);
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Clean up old temporary files (older than 1 hour)
function cleanupOldTempFiles() {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    files.forEach((file) => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtime.getTime() > oneHour) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.warn("Failed to cleanup temp files:", error);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldTempFiles, 30 * 60 * 1000);

// Hair validation specific storage
const hairValidationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `hair_validation_${uniqueId}${ext}`);
  },
});

// File filter for hair validation
const hairValidationFileFilter = (req, file, cb) => {
  // Only allow image files
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif)$/;

  if (!file.originalname.match(imageExtensions)) {
    return cb(
      new BadRequestError(
        "Only image files (jpg, jpeg, png, gif, webp, avif) are allowed for hair validation!"
      ),
      false
    );
  }

  // Check file size (max 10MB for validation)
  if (file.size > 10 * 1024 * 1024) {
    return cb(
      new BadRequestError(
        "File size too large. Maximum size is 10MB for hair validation."
      ),
      false
    );
  }

  cb(null, true);
};

// Hair validation multer instance
const hairValidationUpload = multer({
  storage: hairValidationStorage,
  fileFilter: hairValidationFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 10, // Max 10 files
  },
});

// Cleanup middleware - removes temp files after validation
const cleanupTempFiles = (req, res, next) => {
  // Clean up temp files after response is sent
  res.on("finish", () => {
    try {
      if (req.file) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
    } catch (error) {
      console.warn("Failed to cleanup temp files:", error);
    }
  });
  next();
};

module.exports = {
  hairValidationUpload,
  cleanupTempFiles,
};
