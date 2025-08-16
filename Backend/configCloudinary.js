const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Folder in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"],
    // public_id: (req, file) => file.originalname, // Optional: custom file name
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
