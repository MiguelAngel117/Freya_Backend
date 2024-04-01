const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/getAllCategories`,async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList){
        res.status(500).json({success: false});
    }
    res.send(categoryList);
});

router.post(`/createCategory`, (req, res) => {
    const category = new Category({
        name_category: req.body.name_category,
        url_icon: req.body.url_icon
    });
    category.save().then((createdCategory=>{
        res.status(201).json(createdCategory);
    })).catch((error)=>{
        res.status(500).json({
            error: error,
            success: false
        });
    });
});

module.exports = router;