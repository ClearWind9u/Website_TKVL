const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticateMiddleware } = require("../../middleware/auth-middleware");
const { deleteAccount, viewUser, viewAllPosts, viewPostsByCategory, applyForJob , editProfile} = require("../../controllers/jobseeker");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cvs/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});
const upload = multer({ 
    storage, 
    limits: { fileSize: 20 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .pdf, .doc, and .docx format allowed!'), false);
        }
        cb(null, true);
    }
});
router.post('/deleteAccount', authenticateMiddleware, deleteAccount);
router.get('/viewUser/:id', authenticateMiddleware, viewUser);
router.get('/viewAllPosts', authenticateMiddleware, viewAllPosts);
router.get('/viewPostsByCategory/:categories', authenticateMiddleware, viewPostsByCategory);
router.post('/applyForJob', authenticateMiddleware,  upload.single('cv'),applyForJob);
router.post('/editProfile', authenticateMiddleware, editProfile);

module.exports = router;
