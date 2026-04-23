import express from 'express';
import crypto from 'crypto';

const router = express.Router();

/**
 * @route   POST /api/payment/initialize
 * @desc    Initialize payment with Chapa
 * @access  Public (or Private with auth middleware)
 */
router.post('/initialize', async (req, res) => {
  try {
    const { amount, email, first_name, last_name } = req.body;

    // 1. Basic Validation
    if (!amount || !email || !first_name || !last_name) {
      return res.status(400).json({ 
        message: 'Missing required fields: amount, email, first_name, and last_name are required.' 
      });
    }

    // 2. Generate a unique transaction reference
    // Format: TXN-RandomString-Timestamp
    const tx_ref = `LuxeCart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Prepare Chapa request payload
    const chapaData = {
      amount: Number(amount),
      currency: 'ETB',
      email: email.toLowerCase(),
      first_name: first_name || 'Customer',
      last_name: last_name || 'User',
      tx_ref,
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      customization: {
        title: 'LuxeCart Payment',
        description: 'Quality goods from LuxeCart'
      }
    };

    // 4. Call Chapa API to initialize transaction
    const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chapaData)
    });

    const result = await chapaResponse.json();

    // 5. Handle Chapa API response
    if (result.status === 'success') {
      return res.status(200).json({
        message: 'Payment initialized successfully',
        checkout_url: result.data.checkout_url,
        tx_ref: tx_ref
      });
    } else {
      console.error('Chapa API Error Details:', result);
      return res.status(400).json({
        message: 'Chapa initialization failed',
        error: result.message || 'Unknown error',
        details: result // Send details to help debug
      });
    }

  } catch (error) {
    console.error('Chapa Payment Error:', error);
    res.status(500).json({ 
      message: 'Internal server error during payment initialization',
      error: error.message 
    });
  }
});

export default router;
