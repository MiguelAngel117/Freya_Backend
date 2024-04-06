const {Category} = require('../models/category');

const getCategories = async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList){
        res.status(500).json({success: false});
    }
    res.send(categoryList);
};

createCategory = (req, res) => {
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
}

module.exports = {getCategories, createCategory};