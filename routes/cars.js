const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const paginateResults = require('../middleware/paginationMiddleware');

// Get all cars with pagination
router.get('/', paginateResults(Car), async (req, res) => {
    try {
        const { skip, limit, page, totalDocs, totalPages, hasNextPage, hasPrevPage } = req.pagination;

        const cars = await Car.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: {
                cars,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalDocs,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router; 