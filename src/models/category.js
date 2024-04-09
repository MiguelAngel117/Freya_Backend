const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name_category: String,
    url_icon: String, 
    url_image: String
})

module.exports = mongoose.model('categories', categorySchema);