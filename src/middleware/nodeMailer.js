const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'freyacolboy@gmail.com', 
      pass: 'gboyvmtvkkgitbxf'
    }
  });

module.exports = transporter;