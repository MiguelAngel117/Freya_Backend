const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    name_user: String,
    type_document: String,
    number_document: String,
    address: String,
    city: String,
    country: String,
    department: String,
    number_phone: String,
    email: String
},{
    versionKey: false
});

exports.Person = mongoose.model('persons', personSchema);