import Listing from "../models/listing.model.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import { errorHandler } from "../util/error.js"; // Adjust path

// Multer setup (in-memory storage for file buffer)
const upload = multer({ storage: multer.memoryStorage() });
const initializeClaud = () => {
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error(
      "cloudinary credentials are missing. Please set Cloudniary _KEY_ID and Cloudinary_KEY_SECRET in your environment ."
    );
    return null;
  }
};

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
  const cloud = initializeClaud();
  try {
    // Extract token from headers or cookies
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(errorHandler(401, "Unauthorized: No token provided"));
    }

    // Verify token synchronously (simpler for this case)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    console.log("Authenticated user:", req.user);

    console.log("Request Body:", req.body);
    console.log("File Upload:", req.file);

    let imageUrl = null;

    // Check if an image file is uploaded
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "rental-listings" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
      console.log("Cloudinary Upload Success:", imageUrl);
    } else if (req.body.image) {
      // Use image URL from req.body if no file is uploaded
      imageUrl = Array.isArray(req.body.image)
        ? req.body.image
        : [req.body.image];
      console.log("Using image URL from body:", imageUrl);
    }

    // Create listing with the image URL
    const listing = await Listing.create({
      ...req.body,
      image: imageUrl, // Save as array
      userRef: req.user.id,
    });

    console.log("Created Listing:", listing);
    res.status(201).json({
      success: true,
      message: "Listing created successfully!",
      listing: {
        id: listing._id.toString(),
        ...listing._doc,
      },
    });
  } catch (error) {
    console.error("❌ Error creating listing:", error.stack);
    next(errorHandler(500, "Server error creating listing"));
  }
};
