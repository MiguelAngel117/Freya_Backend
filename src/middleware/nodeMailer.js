const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.tuhost.com', // Cambia esto por el servidor SMTP que vayas a usar
    port: 587, // Puerto del servidor SMTP
    secure: false, // false para TLS; true para SSL
    auth: {
      user: 'freyacolboy@gmail.com', 
      pass: 'gboy vmtv kkgi tbxf'
    }
  });

module.exports = transporter;