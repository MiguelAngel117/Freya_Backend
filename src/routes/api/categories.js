const {
    getCategories,
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    searchCategoriesByName, 
    sortCategories} = require('../../controllers/categoriesController');

const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');

const express = require('express');
const router = express.Router();

router.get(`/sorted`, checkAuth, checkRoleAuth(['admin','user']), sortCategories);
router.get(`/search`, checkAuth, checkRoleAuth(['admin','user']), searchCategoriesByName);
router.get(`/`, checkAuth, checkRoleAuth(['admin','user']),getCategories);
router.get(`/:id`, checkAuth, checkRoleAuth(['admin','user']), getCategory);

router.post(`/`, checkAuth, checkRoleAuth(['admin']), createCategory);

router.put(`/:id`,checkAuth, checkRoleAuth(['admin']), updateCategory);

router.delete(`/:id`, checkAuth, checkRoleAuth(['admin']), deleteCategory);

module.exports = router;