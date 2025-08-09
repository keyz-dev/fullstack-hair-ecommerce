const { BadRequestError } = require("../utils/errors");
const hairValidator = require("../services/hairValidator");

// Validate single hair image
const validateSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new BadRequestError("No image file provided"));
    }

    console.log(`🔍 Validating hair image: ${req.file.originalname}`);

    const validationResult = await hairValidator.validateImage(
      req.file.buffer || req.file.path,
      req.file.originalname
    );

    res.status(200).json({
      success: true,
      message: "Image validation completed",
      data: {
        isValid: validationResult.isValid,
        confidence: validationResult.confidence,
        prediction: validationResult.prediction,
        message: validationResult.message,
        filename: req.file.originalname,
      },
    });
  } catch (err) {
    console.error("❌ Hair image validation error:", err);
    next(err);
  }
};

// Validate multiple hair images
const validateMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new BadRequestError("No image files provided"));
    }

    console.log(`🔍 Validating ${req.files.length} hair images`);

    const validationPromises = req.files.map(async (file, index) => {
      try {
        const result = await hairValidator.validateImage(
          file.buffer || file.path,
          file.originalname
        );
        return {
          filename: file.originalname,
          isValid: result.isValid,
          confidence: result.confidence,
          prediction: result.prediction,
          message: result.message,
          index,
        };
      } catch (error) {
        return {
          filename: file.originalname,
          isValid: false,
          confidence: 0,
          prediction: "error",
          message: `Validation failed: ${error.message}`,
          index,
        };
      }
    });

    const validationResults = await Promise.all(validationPromises);

    const validImages = validationResults.filter((result) => result.isValid);
    const invalidImages = validationResults.filter((result) => !result.isValid);

    res.status(200).json({
      success: true,
      message: "Batch image validation completed",
      data: {
        totalImages: req.files.length,
        validImages: validImages.length,
        invalidImages: invalidImages.length,
        results: validationResults,
        summary: {
          valid: validImages.map((img) => img.filename),
          invalid: invalidImages.map((img) => img.filename),
        },
      },
    });
  } catch (err) {
    console.error("❌ Batch hair image validation error:", err);
    next(err);
  }
};

// Test hair validation environment
const testEnvironment = async (req, res, next) => {
  try {
    console.log("🧪 Testing hair validation environment...");
    
    const testResult = await hairValidator.testEnvironment();
    
    res.status(200).json({
      success: true,
      message: "Environment test completed",
      data: testResult,
    });
  } catch (err) {
    console.error("❌ Hair validation environment test error:", err);
    next(err);
  }
};

module.exports = {
  validateSingleImage,
  validateMultipleImages,
  testEnvironment,
};
