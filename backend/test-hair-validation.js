const hairValidator = require("./src/services/hairValidator");

async function testHairValidation() {
  console.log("🧪 Testing Hair Validation System...\n");

  try {
    // Test 1: Check if model is available
    console.log("1️⃣ Checking model availability...");
    console.log(`   Model available: ${hairValidator.isModelAvailable}`);
    console.log(`   Python path: ${hairValidator.pythonPath}`);
    console.log(`   Script path: ${hairValidator.scriptPath}`);
    console.log(`   Model file: ${hairValidator.modelPath}/hair_model.h5`);
    console.log("");

    if (!hairValidator.isModelAvailable) {
      console.log("❌ Model not available. Cannot run tests.");
      return;
    }

    // Test 2: Test environment
    console.log("2️⃣ Testing environment...");
    const envTest = await hairValidator.testEnvironment();
    console.log(`   Environment test result:`, envTest);
    console.log("");

    // Test 3: Test with a sample image (if available)
    console.log("3️⃣ Testing with sample image...");
    const sampleImagePath =
      "./src/uploads/temp/hair_validation/hair_validation_8cee5e74-aba2-4f80-b451-47d2e6a407f3.jpg";

    if (require("fs").existsSync(sampleImagePath)) {
      console.log(`   Using sample image: ${sampleImagePath}`);
      const result = await hairValidator.validateImage(
        sampleImagePath,
        "test-image"
      );
      console.log(`   Validation result:`, result);
    } else {
      console.log("   No sample image found. Skipping image test.");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
testHairValidation()
  .then(() => {
    console.log("\n✅ Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
