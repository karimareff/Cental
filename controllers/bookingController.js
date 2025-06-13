const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment');

// Create a new booking
exports.createBooking = async (req, res) => {
  console.log("📦 Booking form data:", req.body);

  const { carId, pickupDate, returnDate, pickupLocation } = req.body;

  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).send("Please log in to make a booking");
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).send("Car not found");
    }

    if (!car.available) {
      return res.status(400).send("This car is not available for booking");
    }

    const booking = new Booking({
      user: req.session.user.id,
      car: carId,
      pickupDate,
      returnDate,
      pickupLocation,
      price: car.price
    });

    await booking.save();
    console.log(`✅ Booking saved for user: ${req.session.user.email}`);
    res.send("✅ Booking saved to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    res.status(500).send("❌ Failed to save booking.");
  }
};

// API: Create booking
exports.apiCreateBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, pickupLocation } = req.body;
    
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ error: 'Please log in to make a booking' });
    }
    
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (!car.available) {
      return res.status(400).json({ error: 'Car is not available' });
    }
    
    const booking = new Booking({
      user: req.session.user.id,
      car: carId,
      pickupDate,
      returnDate,
      pickupLocation,
      price: car.price,
      status: 'pending'
    });
    
    const savedBooking = await booking.save();
    
    res.json({ 
      success: true, 
      message: 'Booking created successfully',
      bookingId: savedBooking._id 
    });
    
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get user bookings page
exports.getUserBookings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    console.log('📋 Fetching bookings for user:', req.session.user.id);

    const bookings = await Booking.find({ user: req.session.user.id })
      .populate('car')
      .populate({
        path: 'paymentId',
        model: 'Payment',
        // Don't fail if payment doesn't exist
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance

    console.log(`✅ Found ${bookings.length} bookings for user`);

    res.render('bookings/index', {
      title: 'My Bookings - Car Rental',
      currentPage: 'bookings',
      bookings: bookings || []
    });
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    
    // Fallback: try to get bookings without payment population
    try {
      const basicBookings = await Booking.find({ user: req.session.user.id })
        .populate('car')
        .sort({ createdAt: -1 })
        .lean();
      
      console.log('⚠️ Fallback: showing bookings without payment data');
      
      res.render('bookings/index', {
        title: 'My Bookings - Car Rental',
        currentPage: 'bookings',
        bookings: basicBookings || []
      });
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      res.status(500).render('error', {
        title: 'Error - Car Rental',
        message: 'Unable to load bookings. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? fallbackError : {}
      });
    }
  }
};

// API: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('car')
      .populate('user')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// API: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('car');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
}; 