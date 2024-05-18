const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
        title: String,
        position: String,
        salary: Number,
        requeriments: String,
        ubication: String,
        min_knowledge: String, 
        responsibilities: String
    },{
        timestamps: true,
        versionKey: false
});

module.exports = mongoose.model('jobs', jobSchema);