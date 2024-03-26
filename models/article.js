const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    id_article: Number,
    code_article: String,
    name_article: String,
    price_article: String,
    description_article: String,
    image: String,
    stock: {
        type: Number,
        required: true
    },
    available: Boolean,
    dateCreated: Date
})

exports.Article = mongoose.model('articles', articleSchema);