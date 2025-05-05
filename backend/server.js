const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ ADD THIS
const socketManager = require('./utils/socketManager');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketManager.init(server);

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // ← Add this!
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/', require('./routes/viewRoutes'));
app.use('/auth', require('./routes/oauthRoutes'));
app.use('/auth', require('./routes/tiktokRoutes'));
app.use('/auth', require('./routes/youtubeRoutes'));


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
