const express = require("express");
const router = express.Router();
const { authenticateMiddleware } = require("../../middleware/auth-middleware");
const {
  viewPostById,
  deleteAccount,
  viewUser,
  viewAllPosts,
  viewPostsByCategory,
  applyForJob,
  editProfile,
} = require("../../controllers/jobseeker");
const { uploadCloud } = require("../../config/uploadCloud.js");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/cvs/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });
// const upload = multer({
//     storage,
//     limits: { fileSize: 20 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error('Only .pdf, .doc, and .docx format allowed!'), false);
//         }
//         cb(null, true);
//     }
// });
router.post("/deleteAccount", authenticateMiddleware, deleteAccount);
router.get("/viewUser/:id", authenticateMiddleware, viewUser);
router.get("/viewAllPosts", authenticateMiddleware, viewAllPosts);
router.get(
  "/viewPostsByCategory/:categories",
  authenticateMiddleware,
  viewPostsByCategory
);
router.post(
  "/applyForJob",
  authenticateMiddleware,
  (req, res, next) => {
    uploadCloud.single("cv")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  applyForJob
);

router.post("/editProfile", authenticateMiddleware, editProfile);
router.get("/viewPost/:id", authenticateMiddleware, viewPostById);
module.exports = router;
