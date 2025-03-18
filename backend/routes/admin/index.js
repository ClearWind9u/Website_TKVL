const express = require('express');
const router = express.Router();
const { authenticateMiddleware, isAdmin } = require("../../middleware/auth-middleware");
const { addRecruiter, deleteUser, viewUser, viewAllUser } = require("../../controllers/admin/index");

router.post('/addRecruiter', authenticateMiddleware, isAdmin, addRecruiter);
router.post('/deleteUser', authenticateMiddleware, isAdmin, deleteUser);
router.post('/viewUser/:id', authenticateMiddleware, isAdmin, viewUser);
router.get('/viewAllUser', authenticateMiddleware, isAdmin, viewAllUser);

module.exports = router;