import "dotenv/config"; // Add this line
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testConnection() {
  try {
    console.log("🔄 Testing Cloudinary connection...");
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful!");
    console.log("📋 Status:", result.status);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Cloudinary connection failed:", error.message);
    } else {
      console.error("❌ Cloudinary connection failed:", error);
    }
  }
}

testConnection();
