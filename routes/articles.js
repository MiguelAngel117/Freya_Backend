const {Article} = require('../models/article');
const express = require('express');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const router = express.Router();

//Obtener todos los articulos
router.get('/', async (req, res) => {
    try {
        const articleList = await Article.find();
        res.send(articleList);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/', async (req, res) => {
    try {
        const { code_article, name_article, price_article, description_article, images, stock, category, available } = req.body;

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).send("Invalid category ID");
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).send("Category not found");
        }

        const article = new Article({
            code_article,
            name_article,
            price_article,
            description_article,
            images,
            stock: stock.map(([size, quantity]) => ({ size, quantity })),
            category,
            available,
            dateCreated: new Date()
        });

        const savedArticle = await article.save();
        res.status(201).send(savedArticle);
    } catch (error) {
        console.error("Error creating article:", error);
        res.status(500).send("Internal server error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedArticle = await Article.findByIdAndDelete(id);
        if (!deletedArticle) {
            return res.status(404).send("Article not found");
        }
        res.send(deletedArticle);
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).send("Internal server error");
    }
});

router.delete('/deleteAllArticles', async (req, res) => {
    try {
        await Article.deleteMany({});
        res.send("All articles deleted successfully");
    } catch (error) {
        console.error("Error deleting all articles:", error);
        res.status(500).send("Internal server error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid article ID format");
        }
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).send("Article not found");
        }
        res.send(article);
    } catch (error) {
        console.error("Error searching article by ID:", error);
        res.status(500).send("Internal server error");
    }
});



//TOCA OPTIMIZALOQUE PIDA SOLO LOS PARAMETROS QUE SE LE MANDAN Y NO TODOS
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code_article, name_article, price_article, description_article, images, stock, category, available } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid article ID");
        }

        if(category || typeof category === 'string'){
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).send("Invalid category ID");
            }
    
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(404).send("Category not found");
            }
        }
        
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            {
                code_article,
                name_article,
                price_article,
                description_article,
                images,
                stock: stock.map(([size, quantity]) => ({ size, quantity })),
                category,
                available,
                dateUpdated: new Date()
            },
            { new: true }
        );

        if (!updatedArticle) {
            return res.status(404).send("Article not found");
        }

        res.send(updatedArticle);
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;