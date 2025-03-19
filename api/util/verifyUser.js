// middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      token = req.cookies?.token;
    }

    if (!token) {
      console.error("❌ No token provided in Authorization header or cookies");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Token verification failed:", err.message);
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Unauthorized: Token has expired",
          });
        }
        return res.status(403).json({
          success: false,
          message: "Forbidden: Invalid token",
        });
      }

      console.log("✅ Token verified:", decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("❌ Unexpected error in token verification:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during token verification",
    });
  }
};
