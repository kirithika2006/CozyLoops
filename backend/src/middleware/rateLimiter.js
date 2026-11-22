const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Public storefront pages load several API resources at once. Keep an
  // overall abuse ceiling without exhausting it during normal browsing.
  max: 300,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: 'Too many uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const ownerOtpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many owner login code requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const ownerOtpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const orderCreateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many order attempts. Please try again later.', standardHeaders: true, legacyHeaders: false });
const orderTrackLimiter = rateLimit({ windowMs: 15 *  60 * 1000, max: 60, message: 'Too many tracking requests. Please try again later.', standardHeaders: true, legacyHeaders: false });

module.exports = { limiter, authLimiter, uploadLimiter, ownerOtpRequestLimiter, ownerOtpVerifyLimiter, orderCreateLimiter, orderTrackLimiter };
