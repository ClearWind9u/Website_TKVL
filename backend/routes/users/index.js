const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { getUsers, getUserById } = require('../../controllers/users');

router.get('/', authenticate, (req, res) => {
    const { id } = req.query;
    if (id) {
        return getUserById(req, res);
    }
    return getUsers(req, res);
});
module.exports = router;