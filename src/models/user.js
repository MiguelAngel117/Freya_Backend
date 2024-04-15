const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    second_name: String,
    type_document: String,
    number_document: String,
    birth_day: Date,
    number_phone: String,
    email: String,
    password: String,
    status_user: {
        type: Boolean,
        default: true
    },
    gender: String,
    role: {
        type: String,
        default: "user"
    },
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('users', userSchema);



