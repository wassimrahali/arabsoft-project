const User = require('../models/userModel');
const { validationResult } = require("express-validator");

// Middleware to get user by ID
exports.getUserById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

exports.getUser = (req, res) => {
    const { profile } = req;
    profile.salt = undefined;
    profile.encrypted_password = undefined;
    profile.createdAt = undefined;
    profile.__v = undefined;
    profile.updatedAt = undefined;
    return res.json(profile);
};

// CREATE
exports.createUser = async (req, res) => {
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

    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.json({
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
        });
    } catch (err) {
        let errorMessage = 'Something went wrong.';
        if (err.code === 11000) {
            errorMessage = 'User already exists, please try with a different email';
        }
        return res.status(500).json({ error: errorMessage });
    }
};

// READ
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).exec();
        res.json(users);
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};


// DELETE
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(
            { _id: req.profile._id },
            { useFindAndModify: false }
        ).exec();

        if (!deletedUser) {
            return res.status(500).json({
                error: "Internal Server Error",
            });
        }

        res.json({
            message: "User deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};







// Update user information without photo
exports.updateUserInfo = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        });
    }

    const { profile } = req;
    const { name, email, password, phoneNumber, enterpriseName,adresse } = req.body;

    // Update user fields
    if (name) profile.name = name;
    if (email) profile.email = email;
    if (password) profile.password = password; // Make sure to handle password hashing if needed
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (enterpriseName) profile.enterpriseName = enterpriseName;
    if (adresse) profile.adresse = adresse;


    try {
        const updatedUser = await profile.save();

        // Optional: Customize the response as needed
        const response = {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            enterpriseName: updatedUser.enterpriseName,
            adresse : updatedUser.adresse
        };

        res.json(response);
    } catch (err) {
        let errorMessage = 'Something went wrong.';
        if (err.code === 11000) {
            errorMessage = 'Email already exists, please try with a different email';
        }
        return res.status(500).json({ error: errorMessage });
    }
};
