const express = require('express');
const router = express.Router();
const {recruiterAuth} = require('../../middleware/auth');

const { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../../controllers/articles');

router.get('/', recruiterAuth, (req, res) => {
    const { id } = req.query;
    if (id) {
        return getArticleById(req, res);
    }
    return getArticles(req, res);
});

router.post('/', recruiterAuth, createArticle);
router.put('/', recruiterAuth, updateArticle);
router.delete('/', recruiterAuth, deleteArticle);

module.exports = router;