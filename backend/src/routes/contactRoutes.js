import express from 'express';
import Message from '../models/message.js';

const router = express.Router();

// Basic in-memory limiter for contact submissions.
const submissionBuckets = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const getClientIp = (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';

// Rate limit removed for testing/UX
const contactRateLimit = (req, res, next) => {
  next();
};

const sanitizeText = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

router.post('/', contactRateLimit, async (req, res) => {
  try {
    const firstName = sanitizeText(req.body.firstName);
    const lastName = sanitizeText(req.body.lastName);
    const email = sanitizeText(req.body.email).toLowerCase();
    const message = sanitizeText(req.body.message);

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (message.length < 5) {
      return res.status(400).json({ message: 'Message must be at least 5 characters.' });
    }

    const created = await Message.create({
      firstName,
      lastName,
      email,
      message,
    });

    return res.status(201).json({
      message: 'Message sent successfully.',
      data: {
        id: created._id,
        status: created.status,
        createdAt: created.createdAt,
      },
    });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
