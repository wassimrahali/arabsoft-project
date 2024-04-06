const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference the actual model name
            required: true,
        },
        productName: {
            type: String, // Corrected to String type
            required: true,
        },
        
        entrepriseName: {
            type: String,
        },
        adresse: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
