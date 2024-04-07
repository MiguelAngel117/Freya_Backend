const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    code_article: String,
    name_article: String,
    retail_price: Number,
    medium_price: Number,
    wholesale_price: Number,
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
    size_guide: String,
    color: String
}, {
    timestamps: true,
    versionKey: false
})

exports.Article = mongoose.model('articles', articleSchema);