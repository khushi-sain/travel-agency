require('dotenv').config(); // Load environment variables
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/travelDB';
