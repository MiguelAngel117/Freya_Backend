const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

//Middleware publica resulatdos en vivo
app.use(bodyParser.json());
//Middleware publica de donde vienen los resulatdos
app.use(morgan('tiny'));

const api = process.env.BASE_URL;
const port = 5000;

const productSchema = mongoose.Schema({
    nameProduct: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Products', productSchema);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.get(`${api}/products`, (req, res) => {
    const product ={
        id:12,
        name: "Paper<",
        image: "https://i.pinimg.com/564x/8a/3d/63/8a3d639602e1c3f2acc59130fd095d45.jpg"
    }
    res.send(product);
});

app.post(`${api}/createProduct`, (req, res) => {
    const product= new Product({
        nameProduct: req.body.nameProduct,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    product.save().then((createdProduct=>{
        res.status(201).json(createdProduct);
    })).catch((error)=>{
        res.status(500).json({
            error: error,
            success: false
        });
    });
});

mongoose.connect(process.env.CONNECTION_DB).
then(() => {
    console.log('Connect Database Success 🚀');
}).catch((err) =>{
    console.log(err);
});

app.listen(port, () => {
    console.log(`Ready! 🚀, Server running http://localhost:${port}`);
});
