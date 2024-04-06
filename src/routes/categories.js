const {getCategories, createCategory} = require('../controllers/categoriesController');

const express = require('express');
const router = express.Router();

router.get(`/`, getCategories);

router.post(`/`, createCategory);

module.exports = router;