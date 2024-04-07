const {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName,searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange} = require('../controllers/articleController');
const {checkAuth} = require('../middleware/authMiddle');
const express = require('express');
const router = express.Router();

//Obtener todos los articulos
router.get('/search', searchArticlesByName);
router.get('/searchAC', searchArticlesByNameAndCategory);
router.get('/searchArticleByCategory', searchArticlesByCategory);
router.get('/searchPriceRange', searchArticlesByPriceRange);
router.get('/', getArticles);
router.get('/:id', getArticle);

router.post('/', createArticle);

router.delete('/:id', deleteArticleById);

router.put('/:id', setArticle);

module.exports = router;