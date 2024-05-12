const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //creating a transpoter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    //defining the email options
    const mailOptions = {
        from: 'hello@mail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html:
    };
    //sending the mail
   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;