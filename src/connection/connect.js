const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_DB)
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito 🚀');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = mongoose;
