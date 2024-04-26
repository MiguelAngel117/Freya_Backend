const {createSale, getSales, getSaleById, updateSaleById, deleteSaleById, getSaleByUserId} = require('../../controllers/saleController');
const express = require('express');
const router = express.Router();

router.get(`/`,getSales);
router.get(`/:id`, getSaleById);
router.get(`/getSalesUser/:user_id`, getSaleByUserId);


router.post(`/`, createSale);

router.put(`/:id`, updateSaleById);

module.exports = router;