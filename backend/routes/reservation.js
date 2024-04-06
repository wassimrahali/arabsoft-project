const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController'); // Assuming the controller is in a 'controllers' folder

// Route to handle reservation creation
router.post('/api/reservations', reservationController.createReservation);
router.get('/get-all-reservations', reservationController.getAllReservations);

module.exports = router;
