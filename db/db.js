const mongoose = require('mongoose');
require('dotenv').config();

// const mongoUrl = 'mongodb://localhost:27017/Found_Lost';
// const mongoURL = 'mongodb+srv://pk2693:qIuv12DDiSi2ubyV@found-lost.tgba9.mongodb.net/'


const mongoURL = process.env.MONGODB_URL;
// const mongoUrl = process.env.MONOGODB_URL_LOCAL;

mongoose.connect(mongoURL);

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
