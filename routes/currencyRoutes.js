const express = require('express');
const router = express.Router();
const exchangeRateService = require('../services/exchangeRateService');

// Convert USD to EGP
router.post('/api/convert-currency', async (req, res) => {
  console.log('🚀 Currency conversion endpoint hit!', req.body);
  try {
    const { amount } = req.body;

    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        error: 'Please provide a valid amount greater than 0' 
      });
    }

    const result = await exchangeRateService.convertUSDToEGP(parseFloat(amount));
    
    if (result.success) {
      res.json({
        success: true,
        conversion: result.data
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error || 'Failed to convert currency' 
      });
    }
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get current exchange rate
router.get('/api/exchange-rate', async (req, res) => {
  console.log('📊 Exchange rate endpoint hit!');
  try {
    const result = await exchangeRateService.getExchangeRate();
    
    if (result.success) {
      res.json({
        success: true,
        rate: result.data
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: result.error || 'Failed to get exchange rate' 
      });
    }
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router; 