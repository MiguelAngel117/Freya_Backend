const {createSale, getSales, getSaleById, updateSaleById, deleteSaleById, getSaleByUserId, salesToDay, salesToWeek, salesToMonth} = require('../../controllers/saleController');
const express = require('express');
const router = express.Router();

router.get(`/`, checkAuth, checkRoleAuth(['admin']),getSales);
router.get(`/salesToDay/`, checkAuth, checkRoleAuth(['admin']), salesToDay);
router.get(`/salesToWeek/`, checkAuth, checkRoleAuth(['admin']), salesToWeek);
router.get(`/salesToMonth/`, checkAuth, checkRoleAuth(['admin']), salesToMonth);
router.get(`/:id`, checkAuth, checkRoleAuth(['admin', 'user']), getSaleById);
router.get(`/getSalesUser/:user_id`, checkAuth, checkRoleAuth(['admin', 'user']), getSaleByUserId);

router.post(`/`, createSale);

router.put(`/:id`, checkAuth, checkRoleAuth(['admin', 'user']), updateSaleById);

module.exports = router;