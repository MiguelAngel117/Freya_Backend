const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors())

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(require('./routes'));

app.get("/", (req, res) => {
    res.send("La App está corriendo👀👍🚀🚀").status(200);
});

module.exports = app;