const express = require('express');
const app = express();
require('dotenv').config();
const { initDB, resetDbTables, fillDbWithTestData } = require("./config/init_db");


//Handle command line args
//Not for production REMOVE
const processArgs = process.argv.slice(2); // Skip the first two elements ('node' and 'path/to/your/script')
async function handleDatabaseOperations() {
    for (let arg of processArgs) {
        if (arg === "--reset-db") {
            await resetDbTables();
        } else if (arg === "--init-db") {
            await initDB();
        } else if (arg === "--fill-tables") {
            await fillDbWithTestData();
        }
    }
}
handleDatabaseOperations();



// Middlewares
app.use(express.json()); // for parsing application/json



// Import Routes
const userRoutes = require('./routes/userRoutes');
const openRoutes = require('./routes/openRoutes');
const secureRoutes = require('./routes/secureRoutes');
const adminRoutes = require('./routes/adminRoutes');



// Use Routes
app.use('/api/auth', userRoutes);
app.use('/api/open', openRoutes);
app.use('/api/secure', secureRoutes);
app.use('/api/admin', adminRoutes);




// Export app
module.exports = app;
