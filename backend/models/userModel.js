const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 30,
            minLength: 2,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        encrypted_password: {
            type: String,
            required: true,
        },
        salt: String,
        role: {
            type: String,
            default: 'user',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        enterpriseName: {
            type: String,
            trim: true,
        },
        photo: {
            type: [String], // Change the type to String
        },
        adresse:{type :String}
    },
    { timestamps: true }
);

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.encrypted_password = this.securedPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.method({
    authenticate: function (plainpassword) {
        return this.securedPassword(plainpassword) === this.encrypted_password;
    },

    securedPassword: function (plainpassword) {
        if (!plainpassword) return '';

        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex');
        } catch (err) {
            return 'Error in hashing the password';
        }
    },
});

module.exports = mongoose.model('User', userSchema);
