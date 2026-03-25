import { v2 as cloudinary } from "cloudinary";

console.log("CLOUDINARY ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key_exists: Boolean(process.env.CLOUDINARY_API_KEY),
  api_secret_exists: Boolean(process.env.CLOUDINARY_API_SECRET),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };