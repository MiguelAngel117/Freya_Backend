const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    user: {},
    address_id: {type: mongoose.Schema.ObjectId},
    address: {},
    articles: [{
        article_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'articles'
        },
        size: String,
        quantity: { type: Number, default: 0 },
        total: Number
    }],
    totalSale: Number,
    statusSale: String,
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('sales', saleSchema);