    const {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName,searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange, uploadImage} = require('../../controllers/articleController');
    const checkAuth = require('../../middleware/authMiddle');
    const checkRoleAuth = require('../../middleware/roleAuth');
    const express = require('express');
    const router = express.Router();
    const multer = require('../../middleware/multer');

    router.get('/search', checkAuth, checkRoleAuth(['admin','user']), searchArticlesByName);
    router.get('/searchAC', searchArticlesByNameAndCategory);
    router.get('/searchArticleByCategory', searchArticlesByCategory);
    router.get('/searchPriceRange', searchArticlesByPriceRange);
    router.get('/', checkAuth, checkRoleAuth(['admin', 'user']),getArticles);
    router.get('/:id', checkAuth, checkRoleAuth(['admin','user']), getArticle);

    router.post('/', checkAuth, checkRoleAuth(['admin']), createArticle);
    router.post('/upload', multer.single('image'), uploadImage);

    router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteArticleById);

    router.put('/:id', checkAuth, checkRoleAuth(['admin']),setArticle);

    module.exports = router;