const express = require("express");
const app = express();
const api = process.env.BASE_URL;
const port = 5000;

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log("Ready! 🚀, Server running http://localhost:5000");
});
