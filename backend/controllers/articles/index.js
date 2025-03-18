require('dotenv').config();
const Article = require('../../models/Article');

const getArticles = async (req, res) => {
    const articles = await Article.find();
    if (!articles) return res.status(404).json({ success: false, message: 'No articles found' });
    res.status(200).json({ success: true, data: articles });
};

const getArticleById = async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Please provide an id' });
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
}

const createArticle = async (req, res) => {
    const { title, salary, location, experience, description, requirement } = req.body;
    if (!title || !salary || !location || !experience || !description || !requirement) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    /* ADD Validate with JOI */

    const newArticle = new Article({
        title,
        salary,
        location,
        experience,
        description,
        requirement,
        owner: req.body.user._id
    });
    await newArticle.save();
    res.status(201).json({ success: true, data: newArticle });
}

const updateArticle = async (req, res) => {
    const { title, salary, location, experience, description, requirement } = req.body;

    /* ADD validation */

    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Please provide an id' });
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    article.title = title ? title : article.title;
    article.salary = salary ? salary : article.salary;
    article.location = location ? location : article.location;
    article.experience = experience ? experience : article.experience;
    article.description = description ? description : article.description;
    article.requirement = requirement ? requirement : article.requirement;
    await article.save();
    res.status(200).json({ success: true, data: article });
}

const deleteArticle = async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Please provide an id' });
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    await article.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted' });
}

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };