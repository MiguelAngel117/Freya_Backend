const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name_category: String,
    description_category: String,
    url_icon: String, 
    url_image: String,
    url_size_guide_fem: String,
    url_size_guide_male: String
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('categories', categorySchema);