const multer = require("multer");
const cloudinary = require("cloudinary").v2; // Sửa import thành require
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CVfiles", // Lưu file vào thư mục CVfiles trên Cloudinary
    format: async (req, file) => "pdf", // Chỉ lưu file dưới dạng PDF
    public_id: (req, file) =>
      file.originalname.split(".")[0].replaceAll(" ", "") + Date.now(), // Lấy tên file gốc (không có phần mở rộng)
    resource_type: "raw",
    flags: "attachment",
  },
});

// Middleware Multer
const uploadCloud = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Giới hạn 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .pdf, .doc, and .docx format allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = { uploadCloud };
