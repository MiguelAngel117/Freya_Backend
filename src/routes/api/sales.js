const {createSale, getSales, getSaleById, updateSaleById, deleteSaleById, getSaleByUserId, salesToDay, salesToWeek, salesToMonth} = require('../../controllers/saleController');
const express = require('express');
const router = express.Router();

router.get(`/`,getSales);
router.get(`/salesToDay/`, salesToDay);
router.get(`/salesToWeek/`, salesToWeek);
router.get(`/salesToMonth/`, salesToMonth);
router.get(`/:id`, getSaleById);
router.get(`/getSalesUser/:user_id`, getSaleByUserId);


router.post(`/`, createSale);

router.put(`/:id`, updateSaleById);

module.exports = router;