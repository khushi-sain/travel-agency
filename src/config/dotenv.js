const dotenv = require('dotenv'); 
dotenv.config(); 

module.exports = {
    PORT: process.env.PORT || 5000, 
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/travelDB'
};
