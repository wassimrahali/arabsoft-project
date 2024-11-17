const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Routes
const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');
const ProductRoute = require('./routes/product');
const reservationRoutes = require('./routes/reservation');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose
  .connect(process.env.MongoDB_URL)  // Removed deprecated options
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Database connection failed', err));

// Routes
app.use('/api', AuthRoute);
app.use('/api', UserRoute);
app.use('/api', ProductRoute);
app.use(reservationRoutes);
app.use('/email', emailRoutes);  // Updated route path for email functionality

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
