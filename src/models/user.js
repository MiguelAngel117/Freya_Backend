const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    status_user: Boolean,
    role: {
        type: String,
        default: "user"
    },
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('users', userSchema);



