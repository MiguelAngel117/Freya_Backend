const {getSales, createSale} = require('../../controllers/saleController');
const express = require('express');
const router = express.Router();

//obtener todas las ventas
router.get(`/`,getSales);

//Crear nueva venta
router.post(`/`, createSale);

//module.exports = (app) => app.use("/a../sales", router);
module.exports = router;