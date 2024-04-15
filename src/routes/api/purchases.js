const express = require('express');
const router = express.Router();
const {getPurchases, createPurchase} = require('../../controllers/purchaseController');
//obtener todas las compras
router.get(`/`, getPurchases);

//Crear nueva compra
router.post(`/`, createPurchase);

//module.exports = (app) => app.use("/a../purchases", router);
module.exports = router;