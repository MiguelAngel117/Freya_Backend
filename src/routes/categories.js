const {
    getCategories,
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    searchCategoriesByName, 
    sortCategories} = require('../controllers/categoriesController');

const express = require('express');
const router = express.Router();

router.get(`/sorted`, sortCategories);
router.get(`/search`, searchCategoriesByName);
router.get(`/`, getCategories);
router.get(`/:id`, getCategory);

router.post(`/`, createCategory);

router.put(`/:id`, updateCategory);

router.delete(`/:id`, deleteCategory);

module.exports = (app) => app.use("/api/v1/categories", router);