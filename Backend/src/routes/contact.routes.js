import express from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';
import { generalLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// POST /api/contact/submit - Submit contact form (with rate limiting)
router.post('/submit', generalLimiter, submitContactForm);

export default router;
