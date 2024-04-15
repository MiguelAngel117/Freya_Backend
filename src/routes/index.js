const express = require('express');
const router = express.Router();

const api = process.env.BASE_URL;
require('dotenv/config');

router.use(`${api}/auth`, require('./api/auth'));
router.use(`${api}/stores`, require('./api/stores'));
router.use(`${api}/articles`, require('./api/articles'));
router.use(`${api}/users`, require('./api/users'));
router.use(`${api}/categories`, require('./api/categories'));
router.use(`${api}/sales`, require('./api/sales'));
router.use(`${api}/purchases`, require('./api/purchases'));
router.use(`${api}/jobs`, require('./api/jobs'));

module.exports = router;