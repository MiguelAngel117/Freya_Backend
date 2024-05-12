const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia esto por el servidor SMTP que vayas a usar
    port: 587, // Puerto del servidor SMTP
    secure: false, // false para TLS; true para SSL
    auth: {
      user: 'freyacolboy@gmail.com', 
      pass: 'gboyvmtvkkgitbxf'
    }
  });

module.exports = transporter;