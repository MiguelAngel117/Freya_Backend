const {
    getCategories,
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    searchCategoriesByName, 
    sortCategories, getCategoryByGender} = require('../../controllers/categoriesController');

const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');

const express = require('express');
const router = express.Router();

router.get(`/sorted`, sortCategories);
router.get(`/search`, searchCategoriesByName);
router.get(`/getByGender/:gender`, getCategoryByGender);
router.get(`/`,getCategories);
router.get(`/:id`, getCategory);

router.post(`/`, checkAuth, checkRoleAuth(['admin']), createCategory);

router.put(`/:id`,checkAuth, checkRoleAuth(['admin']), updateCategory);

router.delete(`/:id`, checkAuth, checkRoleAuth(['admin']), deleteCategory);

module.exports = router;