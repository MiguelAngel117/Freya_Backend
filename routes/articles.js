const {Article} = require('../models/article');
const express = require('express');
const router = express.Router();

router.get(`/getAllArticles`,async (req, res) => {
    const articleList = await Article.find();
    if(!articleList){
        res.status(500).json({success: false});
    }
    res.send(articleList);
});

router.post(`/createArticle`, (req, res) => {
    const article = new Article({
        code_article: req.body.code_article,
        name_article: req.body.name_article,
        price_article: req.body.price_article,
        description_article: req.body.description_article,
        image: req.body.image,
        stock: req.body.stock,
        available: req.body.available,
        dateCreated: Date.parse(new Date())
    });
    article.save().then((createdArticle=>{
        res.status(201).json(createdArticle);
    })).catch((error)=>{
        res.status(500).json({
            error: error,
            success: false
        });
    });
});

module.exports = router;