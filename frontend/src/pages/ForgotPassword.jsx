import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      // error handled by axios interceptor
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
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-saree-rose mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to login
        </Link>

        <div className="bg-white rounded-3xl shadow-card p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-saree-charcoal mb-2">Email Sent!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Check your inbox for the password reset link. It expires in 60 minutes.
              </p>
              <Link to="/login" className="btn-primary w-full py-3 block text-center">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-saree-charcoal mb-1">
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email and we'll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
