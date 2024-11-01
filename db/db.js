const mongoose = require('mongoose');

const mongoUrl = 'mongodb://localhost:27017/Found_Lost';

// Set up MongoDB connection
mongoose.connect(mongoUrl);

const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

// Export the database connection
module.exports = db;
