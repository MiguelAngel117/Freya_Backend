const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    articles: [{
        article_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'articles'
        },
        size: String,
        quantity:{type: Number, default: 0},
        total: String
    }],
    totalSale: String,
    statusSale: String,
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: Date
})

exports.Sale = mongoose.model('sales', saleSchema);