
const Admin = require('../models/Admin');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('../utils/generateToken');
const crypto = require('crypto');
const { Resend } = require('resend');
require('dotenv').config();
const OwnerOtp = require('../models/OwnerOtp');

const OTP_EXPIRY_MINUTES = Math.max(
  1,
  Number(process.env.OTP_EXPIRY_MINUTES) || 5
);

const OTP_RESEND_COOLDOWN_SECONDS = Math.max(
  30,
  Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60
);

const MAX_OTP_ATTEMPTS = 5;

const getOtpDigest = (email, otp) => {
  const secret = process.env.OTP_HASH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET or OTP_HASH_SECRET must be configured before owner login can be used.'
    );
  }

  return crypto
    .createHmac('sha256', secret)
    .update(`${email}:${otp}`)
    .digest('hex');
};

// @desc    Request owner login OTP
// @route   POST /api/admin/owner/request-otp
// @access  Public
const requestOwnerOtp = catchAsync(async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const ownerEmail = String(process.env.OWNER_EMAIL || '').trim().toLowerCase();

  if (!ownerEmail || !email || email !== ownerEmail) {
    return next(
      new AppError('This email is not authorized for owner login.', 403)
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(
      new AppError('Owner login token signing is not configured.', 503)
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return next(
      new AppError(
        'Owner email delivery is not configured. Please contact support.',
        503
      )
    );
  }

  const ownerAdminExists = await Admin.exists({ isAdmin: true });

  if (!ownerAdminExists) {
    return next(
      new AppError('No owner admin account is configured.', 503)
    );
  }

  const now = new Date();

  const existing = await OwnerOtp.findOne({ email });

  if (
    existing &&
    now - existing.lastSentAt < OTP_RESEND_COOLDOWN_SECONDS * 1000
  ) {
    const remainingSeconds = Math.ceil(
      (
        OTP_RESEND_COOLDOWN_SECONDS * 1000 -
        (now - existing.lastSentAt)
      ) / 1000
    );

    res.set('Retry-After', String(remainingSeconds));

    return next(
      new AppError('Please wait before requesting another code.', 429)
    );
  }

  const otp = crypto
    .randomInt(0, 1000000)
    .toString()
    .padStart(6, '0');

  const expiresAt = new Date(
    now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  // Store the hashed OTP before sending the email.
  await OwnerOtp.findOneAndUpdate(
    { email },
    {
      email,
      otpHash: getOtpDigest(email, otp),
      expiresAt,
      attempts: 0,
      lastSentAt: now
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: ownerEmail,
      subject: 'Your CozyLoops Owner Login Verification Code',
      text: `Hello,

Your CozyLoops owner login verification code is:

${otp}

This code expires in ${OTP_EXPIRY_MINUTES} minutes.

If you did not request this login, please ignore this email.

Regards,
CozyLoops Team`
    });

    if (error) {
      throw error;
    }

    console.log('Owner OTP email sent successfully:', data?.id);

  } catch (error) {
    // Invalidate the OTP if email delivery fails.
    await OwnerOtp.deleteOne({
      email,
      otpHash: getOtpDigest(email, otp)
    });

    console.error('Owner OTP email delivery failed:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode
    });

    return next(
      new AppError(
        'We could not send your verification code. Please try again.',
        502
      )
    );
  }

  res.status(200).json({
    success: true,
    message: 'A verification code has been sent to the authorized owner email.',
    expiresIn: OTP_EXPIRY_MINUTES * 60,
    resendAfter: OTP_RESEND_COOLDOWN_SECONDS
  });
});

// @desc    Verify owner login OTP
// @route   POST /api/admin/owner/verify-otp
// @access  Public
const verifyOwnerOtp = catchAsync(async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();
  const ownerEmail = String(process.env.OWNER_EMAIL || '').trim().toLowerCase();

  if (!ownerEmail || email !== ownerEmail || !/^\d{6}$/.test(otp)) {
    return next(
      new AppError('Invalid or expired verification code.', 401)
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(
      new AppError('Owner login token signing is not configured.', 503)
    );
  }

  const challenge = await OwnerOtp.findOne({ email }).select('+otpHash');

  if (
    !challenge ||
    challenge.expiresAt <= new Date() ||
    challenge.attempts >= MAX_OTP_ATTEMPTS
  ) {
    if (challenge) {
      await OwnerOtp.deleteOne({ _id: challenge._id });
    }

    return next(
      new AppError('Invalid or expired verification code.', 401)
    );
  }

  const submittedHash = Buffer.from(getOtpDigest(email, otp), 'hex');
  const storedHash = Buffer.from(challenge.otpHash, 'hex');

  if (
    submittedHash.length !== storedHash.length ||
    !crypto.timingSafeEqual(submittedHash, storedHash)
  ) {
    const updated = await OwnerOtp.findOneAndUpdate(
      {
        _id: challenge._id,
        attempts: { $lt: MAX_OTP_ATTEMPTS }
      },
      {
        $inc: { attempts: 1 }
      },
      {
        new: true
      }
    );

    if (updated && updated.attempts >= MAX_OTP_ATTEMPTS) {
      await OwnerOtp.deleteOne({ _id: challenge._id });
    }

    return next(
      new AppError('Invalid or expired verification code.', 401)
    );
  }

  // Atomically consume the OTP to prevent reuse.
  const consumed = await OwnerOtp.findOneAndDelete({
    _id: challenge._id,
    otpHash: challenge.otpHash,
    attempts: { $lt: MAX_OTP_ATTEMPTS },
    expiresAt: { $gt: new Date() }
  });

  if (!consumed) {
    return next(
      new AppError('Invalid or expired verification code.', 401)
    );
  }

  const admin = await Admin.findOne({ isAdmin: true }).sort({
    createdAt: 1
  });

  if (!admin) {
    return next(
      new AppError('No owner admin account is configured.', 503)
    );
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin._id, true);

  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      isAdmin: true,
      lastLogin: admin.lastLogin
    }
  });
});

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return next(
      new AppError('Invalid username or password', 401)
    );
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    return next(
      new AppError('Invalid username or password', 401)
    );
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin._id, admin.isAdmin);

  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      isAdmin: admin.isAdmin,
      lastLogin: admin.lastLogin
    }
  });
});

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin._id;

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  const isPasswordValid = await admin.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return next(
      new AppError('Current password is incorrect', 401)
    );
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getProfile = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin._id).select('-password');

  res.status(200).json({
    success: true,
    admin
  });
});

// @desc    Initialize admin (run once)
// @route   POST /api/admin/init
// @access  Public
const initializeAdmin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    return next(new AppError('Admin already exists', 400));
  }

  const admin = await Admin.create({
    username,
    password
  });

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    admin: {
      id: admin._id,
      username: admin.username
    }
  });
});

module.exports = {
  requestOwnerOtp,
  verifyOwnerOtp,
  login,
  changePassword,
  getProfile,
  initializeAdmin
};
