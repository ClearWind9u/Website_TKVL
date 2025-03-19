const express = require('express');
const router = express.Router();
const { authenticateMiddleware, isRecruiter } = require("../../middleware/auth-middleware");
const { viewUser, viewAllPosts, viewPostsByCategory, createPost , viewAllCV, viewCV, deletePost , editPost, editProfile} 
    = require("../../controllers/recruiter");
router.get('/viewUser/:id', authenticateMiddleware,isRecruiter , viewUser);
router.get('/viewAllPosts', authenticateMiddleware, isRecruiter ,viewAllPosts);
router.get('/viewPostsByCategory/:categories', authenticateMiddleware, isRecruiter ,viewPostsByCategory);
router.post('/createPost', authenticateMiddleware, isRecruiter ,createPost);
router.get('/viewAllCV:id',authenticateMiddleware, isRecruiter ,viewAllCV);
router.get('/viewCV:id',authenticateMiddleware, isRecruiter ,viewCV);
router.post('/deletePost', authenticateMiddleware, isRecruiter ,deletePost);
router.post('/editPost', authenticateMiddleware, isRecruiter ,editPost);
router.post('/editProfile', authenticateMiddleware, isRecruiter ,editProfile);


module.exports = router;