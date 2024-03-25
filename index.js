const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.BASE_URL;
const port = 5000;

app.get("/", (req, res) => {
    res.send("hello world");
});

app.get(api + "/products", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log("Ready! 🚀, Server running http://localhost:5000");
});
