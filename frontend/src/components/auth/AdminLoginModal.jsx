import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaEnvelopeOpenText } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const RESEND_SECONDS = 60;

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const { login } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resendIn) return undefined;
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setOtp('');
      setStep('email');
      setResendIn(0);
      setIsLoading(false);
    }
  }, [isOpen]);

  const requestCode = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await authService.requestOwnerOtp(email.trim());
      setStep('otp');
      setResendIn(result.resendAfter || RESEND_SECONDS);
      toast.success('Verification code sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send the verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Enter the six-digit verification code.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), otp);
    setIsLoading(false);
    if (result.success) {
      onClose();
      navigate('/admin');
      toast.success('Welcome to your cozy.loopsss_ dashboard.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="owner-login-title"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-md rounded-3xl border border-primary-babyPink/40 bg-white p-7 shadow-2xl sm:p-9"
        >
          <button type="button" onClick={onClose} aria-label="Close owner login" className="absolute right-4 top-4 rounded-full p-2 text-secondary-dark/60 transition hover:bg-primary-babyPink/20 hover:text-secondary-dark">
            <FaTimes />
          </button>

          <div className="mb-7 text-center">
            <img src="/cozyloops-trademark.png" alt="" className="mx-auto mb-2 h-16 w-16 rounded-full object-cover" />
            <div className="mb-5 font-display text-2xl font-bold text-primary-rosePink">cozy.loopsss_</div>
            <h2 id="owner-login-title" className="font-display text-2xl font-bold text-secondary-dark">
              {step === 'email' ? 'Welcome Back, Owner!' : 'Check your email'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary-dark/65">
              {step === 'email' ? 'Secure access to your cozy.loopsss_ dashboard.' : `Enter the six-digit code sent to ${email.trim()}.`}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={requestCode} className="space-y-5">
              <label className="block text-sm font-medium text-secondary-dark" htmlFor="owner-email">Authorized email address</label>
              <input
                id="owner-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                required
              />
              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-pink px-5 py-3 font-semibold text-white shadow-soft transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
                {isLoading ? 'Sending code…' : <><FaEnvelopeOpenText /> Send OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <label className="block text-sm font-medium text-secondary-dark" htmlFor="owner-otp">Six-digit verification code</label>
              <input
                id="owner-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="input-field text-center text-2xl tracking-[0.4em]"
                autoComplete="one-time-code"
                required
                autoFocus
              />
              <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full rounded-xl bg-gradient-pink px-5 py-3 font-semibold text-white shadow-soft transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
                {isLoading ? 'Verifying…' : 'Verify and continue'}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => { setStep('email'); setOtp(''); }} className="flex items-center gap-2 text-secondary-dark/65 hover:text-primary-rosePink"><FaArrowLeft /> Change email</button>
                <button type="button" disabled={isLoading || resendIn > 0} onClick={requestCode} className="font-medium text-primary-rosePink disabled:text-secondary-dark/40">
                  {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}
          <p className="mt-6 text-center text-xs text-secondary-dark/45">Owner access only · Code expires in five minutes</p>
        </motion.section>
      </div>
    </AnimatePresence>
  );
};

export default AdminLoginModal;
