const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors= require('cors');

require('dotenv/config');
const port = 5000;

app.use(cors());
app.options('*', cors())

//Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routes 
const articlesRoute = require('./routes/articles');
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');

const api = process.env.BASE_URL;

app.use(`${api}/articles`, articlesRoute);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/categories`, categoriesRoute);


app.get("/", (req, res) => {
    res.send("hello world");
});

//Database
mongoose.connect(process.env.CONNECTION_DB).
then(() => {
    console.log('Connect Database Success 🚀');
}).catch((err) =>{
    console.log(err);
});

app.listen(port, () => {
    console.log(`Ready! 🚀, Server running http://localhost:${port}`);
});