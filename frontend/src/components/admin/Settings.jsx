import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUser, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const Settings = () => {
  const { adminUser, changePassword } = useAdmin();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(formData.currentPassword, formData.newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Settings
        </h2>
        <p className="text-secondary-dark/60">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="card-premium p-6">
          <h3 className="font-display text-lg font-bold text-secondary-dark mb-4 flex items-center gap-2">
            <FaUser className="text-primary-rosePink" />
            Profile Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-secondary-dark/60">Username</p>
              <p className="font-semibold text-secondary-dark">{adminUser?.username || 'CozyLoops21'}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-dark/60">Role</p>
              <p className="font-semibold text-secondary-dark">Administrator</p>
            </div>
            <div>
              <p className="text-sm text-secondary-dark/60">Last Login</p>
              <p className="font-semibold text-secondary-dark">
                {adminUser?.lastLogin ? new Date(adminUser.lastLogin).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card-premium p-6">
          <h3 className="font-display text-lg font-bold text-secondary-dark mb-4 flex items-center gap-2">
            <FaLock className="text-primary-rosePink" />
            Change Password
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark/40 hover:text-secondary-dark"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark/40 hover:text-secondary-dark"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-secondary-dark/40 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-dark mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-dark/40 hover:text-secondary-dark"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <FaSave className="mr-2" />
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="card-premium p-6">
        <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
          About CozyLoops
        </h3>
        <div className="space-y-2 text-sm text-secondary-dark/70">
          <p>Version: 1.0.0</p>
          <p>Theme: CozyLoops Premium</p>
          <p>Admin Panel: v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;