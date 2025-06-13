const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Main routes
router.get('/', carController.getHomepage);
router.get('/car/:id', carController.getCarDetails);
router.get('/cars', carController.getAllCars);

// API routes
router.get('/api/cars/search', carController.searchCars);
router.get('/api/cars/filter', carController.filterCars);
router.get('/api/cars/:id', carController.getCarById);
router.post('/api/cars/availability', carController.checkCarAvailability);

module.exports = router; 