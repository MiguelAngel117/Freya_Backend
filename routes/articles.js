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
        nameArticle: req.body.nameArticle,
        image: req.body.image,
        countInStock: req.body.countInStock
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