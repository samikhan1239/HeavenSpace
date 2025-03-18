import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    console.error("❌ No token provided in Authorization header");
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return next(errorHandler(403, "Forbidden: Invalid token"));
    }

    console.log("✅ Token verified:", user);
    req.user = user;
    next();
  });
};
