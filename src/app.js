const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors= require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors())

//Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routes 
const articlesRoute = require('./routes/articles');
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');
const salesRoute = require('./routes/sales');
const purchasesRoute = require('./routes/purchases');

const api = process.env.BASE_URL;

app.use(`${api}/articles`, articlesRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/sales`, salesRoute);
app.use(`${api}/purchases`, purchasesRoute);


app.get("/", (req, res) => {
    res.send("hello world");
});

module.exports = app;