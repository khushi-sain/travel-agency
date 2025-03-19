const config = require('config');

const dbConfig = config.get('db'); // Get DB config values

console.log("Database Config:", dbConfig);
