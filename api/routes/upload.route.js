import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Image Endpoint
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader
      .upload_stream(
        { folder: "rental-listings" }, // Folder name in Cloudinary
        (error, result) => {
          if (error) return res.status(500).json({ error: error.message });
          res.json({ url: result.secure_url });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
