const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name_category: String,
    url_icon: String, 
    url_image: String
})

exports.Category = mongoose.model('categories', categorySchema);