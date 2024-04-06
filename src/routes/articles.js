const {getArticles, getArticle, createArticle, deleteArticle, deleteArticles, setArticle} = require('../controllers/articleController');
const {checkAuth} = require('../middleware/authMiddle');
const express = require('express');
const router = express.Router();

//Obtener todos los articulos
router.get('/', getArticles);

router.post('/', createArticle);

router.delete('/:id', deleteArticle);

router.delete('/deleteAllArticles', deleteArticles);

router.get('/:id', getArticle);

//TOCA OPTIMIZALOQUE PIDA SOLO LOS PARAMETROS QUE SE LE MANDAN Y NO TODOS
router.put('/:id', setArticle);

module.exports = router;