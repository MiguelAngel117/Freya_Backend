const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    code_article: String,
    name_article: String,
    price_article: String,
    description_article: String,
    images: {},
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'categories'
    },
    stock: [{
        size: String, 
        quantity:{type: Number, default: 0}
    }],
    available: Boolean,
    gender: String,
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: Date
})

exports.Article = mongoose.model('articles', articleSchema);