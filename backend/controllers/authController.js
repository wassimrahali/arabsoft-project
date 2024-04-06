const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const jwtToken = require('jsonwebtoken');
const { expressjwt: jwt } = require("express-jwt");

// SIGNUP
exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    const { role } = req.body;

    if (role && role !== "user" && role !== "admin") {
        return res.status(422).json({
            error: "Invalid role. Allowed roles: user, admin",
        });
    }

    const user = new User(req.body);
    user.save()
        .then(user => {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        })
        .catch(err => {
            let errorMessage = 'Something went wrong.';
            if (err.code === 11000) {
                errorMessage = 'User already exists, please signin';
            }
            return res.status(500).json({ error: errorMessage });
        });
};

// SIGNIN
exports.signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    const { email, password } = req.body;
    await User.findOne({ email: `${email}` })
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    error: "User not found"
                });
            }

            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Email or Password does not exist"
                });
            }

            // Setting Cookies
            const token = jwtToken.sign({ _id: user._id }, 'shhhhh');
            res.cookie("token", token, { expire: new Date() + 9999 })
            const { _id, name, email, role } = user;
            return res.json({ token, user: { _id, name, email, role } });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: "Internal Server Error"
            });
        });
};

// SIGNOUT
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User has signed out"
    });
};

// Protected Route 
exports.isSignedIn = jwt({
    secret: 'shhhhh',
    userProperty: "auth",
    algorithms: ['HS256']
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== "admin") {
        return res.status(403).json({
            error: "Access denied. Only admin users are allowed.",
        });
    }
    next();
};

// Manual sign-in as admin (temporary function)
exports.signInAsAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin user by email
        const adminUser = await User.findOne({ email: `${email}`, role: 'admin' });

        if (!adminUser) {
            return res.status(400).json({
                error: "Admin user not found"
            });
        }

        // Authenticate the admin user
        if (!adminUser.authenticate(password)) {
            return res.status(401).json({
                error: "Email or Password does not exist"
            });
        }

        // Generate JWT token
        const token = jwtToken.sign({ _id: adminUser._id }, 'shhhhh');

        // Set the token in the response cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        // Send the user data and token in the response
        const { _id, name, email, role } = adminUser;
        return res.json({ token, user: { _id, name, email, role } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
