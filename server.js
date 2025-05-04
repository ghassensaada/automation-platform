const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketManager = require('./utils/socketManager');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketManager.init(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
