const mongoose = require('mongoose');

const storeShema = new mongoose.Schema({
    name_store: String,
    address: String,
    coordinates: {},
    department: String,
    city: String, 
    images:{}
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('stores', storeShema);