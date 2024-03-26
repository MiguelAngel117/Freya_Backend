const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const port = 5000;

//Middleware publica resulatdos en vivo
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routes 
const articlesRoute = require('./routes/articles');


const api = process.env.BASE_URL;

app.use(`${api}/articles`, articlesRoute);



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