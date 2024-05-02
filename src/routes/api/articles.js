    const {getArticles, getArticle, createArticle, deleteArticleById, setArticle, searchArticlesByName,searchArticlesByNameAndCategory, searchArticlesByCategory, searchArticlesByPriceRange, uploadImage, getArticleByGender, getArticleByGenderAndCategory, uploadImageN} = require('../../controllers/articleController');
    const checkAuth = require('../../middleware/authMiddle');
    const checkRoleAuth = require('../../middleware/roleAuth');
    const express = require('express');
    const router = express.Router();
    const multer = require('../../middleware/multer');

    router.get('/search', searchArticlesByName);
    router.get('/searchArticleByGender', getArticleByGender);
    router.get('/searchArticleGenAndCat', getArticleByGenderAndCategory);
    router.get('/searchAC', searchArticlesByNameAndCategory);
    router.get('/searchArticleByCategory', searchArticlesByCategory);
    router.get('/searchPriceRange', searchArticlesByPriceRange);
    router.get('/',getArticles);
    router.get('/:id', getArticle);

    router.post('/', checkAuth, checkRoleAuth(['admin']), createArticle);
    router.post('/uploadCloud', multer.single('image'), uploadImageN);
    router.post('/upload', uploadImage);

    router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteArticleById);

    router.put('/:id', checkAuth, checkRoleAuth(['admin']),setArticle);

    module.exports = router;