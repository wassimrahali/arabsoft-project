const Reservation = require('../models/reservationModel');
const Product = require('../models/productModel');

// Reservation controller
exports.createReservation = async (req, res) => {
    try {
        const { name, email, phoneNumber, productId, adresse,entrepriseName } = req.body;

        // Validate incoming data
        if (!name || !email || !phoneNumber || !productId || !entrepriseName || !adresse) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the product ID is valid
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Create a new reservation
        const reservation = new Reservation({
            name,
            email,
            phoneNumber,
            adresse,
            entrepriseName,
            productName: product.name, // Use the product name from the retrieved product
            productId
            
        });

        // Save the reservation to the database
        const savedReservation = await reservation.save();

        res.status(201).json({ message: 'Reservation created successfully', reservation: savedReservation });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json({ reservations });
    } catch (error) {
        console.error('Error getting reservations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
