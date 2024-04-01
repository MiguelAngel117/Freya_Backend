const mongoose = require('mongoose');

then(() => {
    mongoose.connect(process.env.CONNECTION_DB);
    console.log('Connect Database Success 🚀');
}).catch((err) =>{
    console.log(err);
});

module.exports = mongoose;