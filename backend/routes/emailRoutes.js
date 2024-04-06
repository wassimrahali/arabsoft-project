const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    console.log(email, subject, message);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully!');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

router.post('/sendemail', sendEmail);

module.exports = router;
