import cloudinary from "../utils/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "user_management", // Adjust as needed
      allowed_formats: ["jpg", "jpeg", "png"], // Adjust formats if needed
    },
  });
  
  // Initialize multer with Cloudinary storage
  const upload = multer({ storage: storage });

  const imageUpload=upload.single("image")

  export {imageUpload}
