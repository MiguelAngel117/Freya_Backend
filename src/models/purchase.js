const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
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
    totalPurchase: String,
    statusPurchase: String
},{
    timestamps: true,
    versionKey: false
})

exports.Purchase = mongoose.model('purchases', purchaseSchema);