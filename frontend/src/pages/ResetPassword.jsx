import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-saree flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-card p-8">
          <h1 className="font-display text-2xl font-bold text-saree-charcoal mb-1">Reset Password</h1>
          <p className="text-gray-500 text-sm mb-6">Choose a new strong password</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'New Password', field: 'password', showToggle: true },
              { label: 'Confirm Password', field: 'confirm', showToggle: false },
            ].map(({ label, field, showToggle }) => (
              <div key={field}>
                <label className="input-label">{label}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder="Min. 6 characters"
                    className="input-field pl-11 pr-11"
                    required
                  />
                  {showToggle && (
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
