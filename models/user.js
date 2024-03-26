const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name_user: String,
    type_document: String,
    number_document: String,
    address: String,
    city: String,
    country: String,
    department: String,
    number_phone: String,
    email: String,
    password: String,
    status_user: String,
    isAdmin: Boolean
})

exports.User = mongoose.model('users', userSchema);