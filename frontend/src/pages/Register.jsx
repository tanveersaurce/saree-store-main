import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../context/store';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', gender: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await registerUser({ name: form.name, email: form.email, password: form.password, phone: form.phone, gender: form.gender });
    if (result.success) navigate('/', { replace: true });
    else setErrors({ form: result.message });
  };

  return (
    <div className="min-h-screen bg-gradient-saree flex">
      {/* Left decorative panel (Advertisement) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&h=1200&fit=crop"
          alt="Beautiful Saree Advertisement"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Rich gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-saree-charcoal/90 via-saree-charcoal/50 to-transparent" />
        
        {/* Content */}
        <div className="relative text-center text-white px-10 z-10">
          <p className="font-accent text-6xl italic mb-2 text-saree-gold">Saaj</p>
          <p className="font-display text-3xl font-bold mb-4">Elegance in Every Thread</p>
          <p className="text-white/80 text-base leading-relaxed max-w-md mx-auto">
            Join our community to access exclusive handloom heritage, custom tailoring, and early access to fresh weaver arrivals.
          </p>
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-saree-rose mb-6 transition-colors">
            <ArrowLeft size={15} /> Back to shop
          </Link>

          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-saree-charcoal">Create Account</h1>
            <p className="text-gray-500 mt-1">Join thousands of saree lovers</p>
          </div>

          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Sharma"
                  className={`input-field pl-11 ${errors.name ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className={`input-field pl-11 ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="input-label">Phone (optional)</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-11 pr-11 ${errors.password ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className={`input-field pl-11 ${errors.confirmPassword ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <p className="text-xs text-gray-400 leading-normal">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-saree-rose hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-saree-rose hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Account 🌸'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-saree-rose font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
