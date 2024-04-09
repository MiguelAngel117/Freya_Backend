const {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName,searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange, uploadImage} = require('../controllers/articleController');
const {checkAuth} = require('../middleware/authMiddle');
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');

//Obtener todos los articulos
router.get('/search', searchArticlesByName);
router.get('/searchAC', searchArticlesByNameAndCategory);
router.get('/searchArticleByCategory', searchArticlesByCategory);
router.get('/searchPriceRange', searchArticlesByPriceRange);
router.get('/', getArticles);
router.get('/:id', getArticle);

router.post('/', createArticle);
router.post('/upload', multer.single('image'), uploadImage);

router.delete('/:id', deleteArticleById);

router.put('/:id', setArticle);

module.exports = (app) => app.use("/api/v1/articles", router);