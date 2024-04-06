const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();
const emailRoutes = require('./routes/emailRoutes');

// Routes
const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');
const ProductRoute = require('./routes/product');
const reservationRoutes = require('./routes/reservation');

// Database connection
mongoose
  .connect(process.env.MongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Database connection failed', err));

// Starting the application
const port = process.env.PORT || 8000;
const app = express();

app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Calling the routes
app.use('/api', AuthRoute);
app.use('/api', UserRoute);
app.use('/api', ProductRoute);
app.use(reservationRoutes);
app.use('/email', emailRoutes); // Updated route path

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
