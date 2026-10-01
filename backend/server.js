const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const checkPasswordRoute = require('./routes/checkPassword');
const bulkCheckRoute = require('./routes/bulkCheck');
const emailCheckRoute = require('./routes/emailCheck');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to call the backend
app.use(express.json()); // Parse JSON payloads

// Routes
app.use('/api', checkPasswordRoute);
app.use('/api', bulkCheckRoute);
app.use('/api', emailCheckRoute);

// Error Handling Middleware (should be last)
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});
