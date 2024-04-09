const {login, register} = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

module.exports = (app) => app.use("/api/v1/auth", router);