const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

// SIGNUP
router.post('/signup', authController.signup);

// SIGNIN
router.post('/signin', authController.signin);

// SIGNOUT
router.get('/signout', authController.signout);
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.send({ Status: 'User not existed' });
        }

const token = jwt.sign({ id: user._id }, 'jwt_secret_key', { expiresIn: '1d' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'wassimrahali40@gmail.com',
                pass: 'khvngrhypimabsef',
            },
        });

        const mailOptions = {
            from: 'wassimrahali40@gmail.com',
            to: user.email, // Use user.email instead of hardcoded email
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset-password/${user._id}/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                return res.send({ Status: 'Success' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Status: 'Internal Server Error' });
    }
});

// Reset Password
router.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        jwt.verify(token, 'jwt_secret_key', async (err, decoded) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ status: 'Error with token' });
            }

            const hash = await bcrypt.hash(password, 10);
            
            // Fetch the user by ID
            const user = await UserModel.findById(id);

            // Set the password using the virtual setter
            user.password = password;
            
            // Save the user to trigger the virtual setter and encryption logic
            await user.save();

            return res.json({ status: 'password changed' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'Internal Server Error' });
    }
});


// Protected Route for testing
router.get('/testroute', authController.isSignedIn, (req, res) => {
    res.send('A protected route');
});

// Admin Dashboard Route (protected)
router.get('/admin-dashboard', authController.isSignedIn, authController.isAdmin, (req, res) => {
    res.send('Admin Dashboard');
});

// Temporary route to sign in as admin
router.post('/signin-as-admin', authController.signInAsAdmin);

module.exports = router;
