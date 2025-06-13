require('dotenv').config(); // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
<<<<<<< HEAD
const carsRouter = require('./routes/cars');
=======
const currencyRoutes = require('./routes/currencyRoutes');
>>>>>>> 8b0ace7af264ad2d093e986c2e82964fb92460aa

// Import middleware
const { sessionToLocals } = require('./middleware/auth');

const app = express();
const port = 3000;

// === MongoDB Connection ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas connected via .env"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// === Session Configuration ===
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    touchAfter: 24 * 3600 // Lazy session update
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict' // CSRF protection
  },
  name: 'sessionId', // Change default session name for security
  rolling: true // Reset expiration on activity
}));

// === Security Headers Middleware ===
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'"
  );
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  next();
});

// === Middleware ===
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing for AJAX requests
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Apply session middleware for templates
app.use(sessionToLocals);

// === Routes ===
app.use('/', carRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', bookingRoutes);
app.use('/', contactRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
<<<<<<< HEAD
app.use('/api/cars', carsRouter);
=======
app.use('/', currencyRoutes);

console.log('✅ Currency routes loaded successfully!');
>>>>>>> 8b0ace7af264ad2d093e986c2e82964fb92460aa

// 404 handler
app.use((req, res) => {
  res.status(404).send("❌ Page Not Found");
});

// Start server
app.listen(port, () => {
  console.log(`🚗 Car Rental app running at http://localhost:${port}`);
});

