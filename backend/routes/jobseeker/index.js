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
  viewAllJobAppications
} = require("../../controllers/jobseeker");
const { uploadCloud } = require("../../config/uploadCloud.js");

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
router.get(
  "/viewAllJobApplications",
  authenticateMiddleware,
  viewAllJobAppications
);
module.exports = router;
