import Listing from "../models/listing.model.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Multer setup (in-memory storage for file buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to handle image upload
export const uploadImage = upload.single("image");

// Create Listing with Image Upload
export const createListing = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Log incoming data
    console.log("File Upload:", req.file); // Log file details (if any)
    let imageUrl = null;

    // Check if an image file is uploaded
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "rental-listings" }, // Cloudinary folder
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url; // Get Cloudinary URL
      console.log("Cloudinary Upload Success:", imageUrl);
    }

    // Create listing with the uploaded image URL
    const listing = await Listing.create({
      ...req.body,
      image: imageUrl, // Save image URL in DB
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully!",
      listing,
    });
  } catch (error) {
    next(error);
  }
};
