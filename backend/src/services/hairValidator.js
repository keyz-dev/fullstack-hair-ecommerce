const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

/**
 * Hair Validation Service
 * Integrates with the trained hair classification model for real-time validation
 */
class HairValidator {
  constructor() {
    this.modelPath = path.join(__dirname, "..", "scripts");
    this.pythonPath = path.join(
      __dirname,
      "..",
      "..",
      "model_api_env",
      "Scripts",
      "python.exe"
    );
    this.scriptPath = path.join(this.modelPath, "predict.py");

    // Check if model environment exists
    this.isModelAvailable =
      fs.existsSync(this.pythonPath) &&
      fs.existsSync(this.scriptPath) &&
      fs.existsSync(path.join(this.modelPath, "hair_model.h5"));

    if (this.isModelAvailable) {
      const modelPath = path.join(this.modelPath, "hair_model.h5");
      const stats = fs.statSync(modelPath);
      const modelSizeMB = Math.round(stats.size / 1024 / 1024);
      console.log(`✅ Hair validation model ready (${modelSizeMB}MB)`);
    } else {
      console.warn("⚠️ Hair validation model not available");
    }
  }

  /**
   * Fallback validation when Python script fails
   */
  async fallbackValidation(imageData, fieldname) {
    try {
      // Basic image format validation
      if (Buffer.isBuffer(imageData)) {
        const header = imageData.slice(0, 8);
        const isJPEG =
          header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
        const isPNG =
          header[0] === 0x89 &&
          header[1] === 0x50 &&
          header[2] === 0x4e &&
          header[3] === 0x47;

        if (!isJPEG && !isPNG) {
          return {
            isValid: false,
            confidence: 0,
            prediction: "other",
            message: "Invalid image format - only JPEG and PNG are supported",
          };
        }
      }

      return {
        isValid: true,
        confidence: 0.5,
        prediction: "hair",
        message: "Image accepted via fallback validation",
      };
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        prediction: "error",
        message: "Validation failed",
      };
    }
  }

  /**
   * Validate if an image contains hair-related content
   * @param {Buffer|string} imageData - Image buffer or file path
   * @param {string} fieldname - Field name for logging
   * @returns {Promise<Object>} Validation result
   */
  async validateImage(imageData, fieldname = "unknown") {
    if (!this.isModelAvailable) {
      return this.fallbackValidation(imageData, fieldname);
    }

    try {
      let imagePath;
      let shouldCleanup = false;

      // Handle both Buffer and file path
      if (Buffer.isBuffer(imageData)) {
        const tempDir = path.join(os.tmpdir(), "hair_validation");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFileName = `hair_validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        imagePath = path.join(tempDir, tempFileName);
        fs.writeFileSync(imagePath, imageData);
        shouldCleanup = true;
      } else {
        imagePath = imageData;
      }

      try {
        const result = await this.runPrediction(imagePath);

        // Clean up temp file if we created one
        if (shouldCleanup && fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.warn("Failed to delete temp validation file:", err);
          }
        }

        return {
          isValid: result.prediction === "hair",
          confidence: result.confidence.hair,
          prediction: result.prediction,
          message:
            result.prediction === "hair"
              ? "Image contains hair content"
              : "Image does not contain hair content",
        };
      } catch (predictionError) {
        // Clean up temp file if we created one
        if (shouldCleanup && fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.warn("Failed to delete temp validation file:", err);
          }
        }

        // Use fallback validation when ML fails
        return this.fallbackValidation(imageData, fieldname);
      }
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        prediction: "error",
        message: "Validation failed",
      };
    }
  }

  /**
   * Run Python prediction script
   * @param {string} imagePath - Path to image file
   * @returns {Promise<Object>} Prediction result
   */
  async runPrediction(imagePath) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(
        this.pythonPath,
        [this.scriptPath, imagePath],
        {
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 60000,
          windowsHide: true,
          env: {
            ...process.env,
            PYTHONUNBUFFERED: "1",
            TF_CPP_MIN_LOG_LEVEL: "3",
            TF_ENABLE_ONEDNN_OPTS: "0",
          },
        }
      );

      let stdout = "";
      let stderr = "";

      // Collect stdout data
      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      // Collect stderr data
      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
        console.log(`🐍 Python stderr: ${data.toString()}`);
      });

      // Handle process completion
      pythonProcess.on("close", (code) => {
        console.log(`🐍 Python process exited with code: ${code}`);

        if (code !== 0) {
          console.error(`🐍 Python script failed with exit code: ${code}`);
          console.error(`🐍 stderr: ${stderr}`);
          return reject(
            new Error(
              `Python script failed with exit code: ${code}. stderr: ${stderr}`
            )
          );
        }

        try {
          // Try to parse the output as JSON
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (parseError) {
          console.error(
            `🐍 Failed to parse Python output as JSON: ${parseError.message}`
          );
          console.error(`🐍 Raw output: ${stdout}`);
          reject(
            new Error(
              `Failed to parse Python output: ${parseError.message}. Raw output: ${stdout}`
            )
          );
        }
      });

      // Handle process errors
      pythonProcess.on("error", (error) => {
        console.error(`🐍 Failed to start Python process: ${error.message}`);
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });

      // Handle timeout
      pythonProcess.on("timeout", () => {
        console.error("🐍 Python process timed out after 30 seconds");
        pythonProcess.kill("SIGKILL");
        reject(new Error("Python process timed out after 30 seconds"));
      });

      // Kill process if it takes too long (backup timeout)
      setTimeout(() => {
        if (!pythonProcess.killed) {
          console.error("🐍 Python process killed due to timeout");
          pythonProcess.kill("SIGKILL");
          reject(new Error("Python process killed due to timeout"));
        }
      }, 65000);
    });
  }

  /**
   * Validate multiple images
   * @param {Array} images - Array of image files or buffers
   * @returns {Promise<Array>} Array of validation results
   */
  async validateMultipleImages(images) {
    const validationPromises = images.map((image, index) =>
      this.validateImage(image, `image_${index}`)
    );

    return Promise.all(validationPromises);
  }

  /**
   * Check if validation should be enforced
   * @returns {boolean} Whether strict validation is enabled
   */
  isStrictMode() {
    return process.env.HAIR_VALIDATION_STRICT === "true";
  }

  /**
   * Get minimum confidence threshold
   * @returns {number} Minimum confidence required
   */
  getMinConfidence() {
    return parseFloat(process.env.HAIR_VALIDATION_MIN_CONFIDENCE) || 0.6;
  }
}

// Export both the class and an instance for backward compatibility
const hairValidatorInstance = new HairValidator();

module.exports = HairValidator;
module.exports.instance = hairValidatorInstance;

// For backward compatibility, also export the instance methods directly
Object.getOwnPropertyNames(HairValidator.prototype).forEach((method) => {
  if (method !== "constructor") {
    module.exports[method] = hairValidatorInstance[method].bind(
      hairValidatorInstance
    );
  }
});
