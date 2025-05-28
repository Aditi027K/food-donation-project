// backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();

// CORS: Allow all origins (best for dev, restrict for prod)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
app.use(express.json());

// Test route (for debugging only)
app.get('/test', (req, res) => res.send('Test route working!'));

// Import and use main API routes
const foodRoutes = require('./routes/foodRoutes');
app.use('/api', foodRoutes);

// Start server
const PORT = 8084;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});
