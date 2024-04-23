    const {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName,searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange, uploadImage} = require('../../controllers/articleController');
    const checkAuth = require('../../middleware/authMiddle');
    const checkRoleAuth = require('../../middleware/roleAuth');
    const express = require('express');
    const router = express.Router();
    const multer = require('../../middleware/multer');

    //Obtener todos los articulos
    router.get('/search', checkAuth, checkRoleAuth(['admin']), searchArticlesByName);
    router.get('/searchAC', searchArticlesByNameAndCategory);
    router.get('/searchArticleByCategory', searchArticlesByCategory);
    router.get('/searchPriceRange', searchArticlesByPriceRange);
    router.get('/', checkAuth, checkRoleAuth(['admin']),getArticles);
    router.get('/:id', checkAuth, checkRoleAuth(['admin']), getArticle);

    router.post('/', checkAuth, checkRoleAuth(['admin']), createArticle);
    router.post('/upload', multer.single('image'), uploadImage);

    router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteArticleById);

    router.put('/:id', checkAuth, checkRoleAuth(['admin']),setArticle);

    module.exports = router;