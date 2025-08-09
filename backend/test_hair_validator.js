const HairValidator = require("./src/services/hairValidator");

async function testHairValidator() {
  console.log("🧪 Testing Hair Validator Service...\n");

  const validator = new HairValidator();

  // Check status
  console.log("📊 Service Status:");
  console.log(JSON.stringify(validator.getStatus(), null, 2));
  console.log("");

  // Test environment
  console.log("🔧 Testing Python Environment...");
  try {
    const envTest = await validator.testEnvironment();
    console.log(JSON.stringify(envTest, null, 2));
  } catch (error) {
    console.error("❌ Environment test failed:", error.message);
  }
  console.log("");

  // Test with a sample image if available
  const testImagePath = "./src/uploads/temp/hair_validation/test.jpg";
  if (require("fs").existsSync(testImagePath)) {
    console.log("🖼️ Testing with sample image...");
    try {
      const result = await validator.validateImage(testImagePath, "test_image");
      console.log("✅ Validation result:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("❌ Validation test failed:", error.message);
    }
  } else {
    console.log("ℹ️ No test image found, skipping validation test");
  }
}

testHairValidator().catch(console.error);
