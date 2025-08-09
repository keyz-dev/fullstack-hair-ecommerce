const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const HairValidator = require("../services/hairValidator");

const router = express.Router();
const APIs = fs.readdirSync(path.join(__dirname));

router.use(express.json({ limit: "50mb", extended: false }));
router.use(express.urlencoded({ limit: "50mb", extended: false }));
router.use(cors());

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const hairValidator = new HairValidator();
    const modelStatus = hairValidator.isModelAvailable
      ? "available"
      : "unavailable";

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      model: {
        status: modelStatus,
        path: hairValidator.modelPath,
        pythonPath: hairValidator.pythonPath,
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

APIs.forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const route = require(path.join(__dirname, file));
    const fileName = file.split(".")[0];
    router.use(`/${fileName}`, route);
  }
});

module.exports = router;
