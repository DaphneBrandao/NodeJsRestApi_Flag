//USING MAILTRAP
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass } = require('../config/mail.json');
/* credentials from mailtrap:
    - changing the credentials below at config> mail.json
*/
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  //configuration of handlebars
  transport.use('compile', hbs({
    viewEngine: 'handlebars',
    //folder of mail templates
    viewPath: path.resolve('./src/resources/mail/'),
    //extension
    extName:'.html',
}));

module.exports = transport;