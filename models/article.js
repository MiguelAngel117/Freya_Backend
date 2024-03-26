const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    nameArticle: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.Article = mongoose.model('articles', articleSchema);