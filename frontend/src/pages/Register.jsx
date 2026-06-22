import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../context/store';

const QUOTES = [
  { text: 'Elegance is not about being noticed, it is about being remembered.', author: 'Giorgio Armani' },
  { text: 'Wear what makes your soul smile.', author: 'Saaj Atelier' },
  { text: 'Every thread tells a story worth wearing.', author: 'Weavers of India' },
];

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.12
    }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', gender: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [quoteIdx, setQuoteIdx] = useState(0);

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

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-saree-blush flex items-center justify-center p-4 md:p-8">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-5xl min-h-[620px] flex rounded-2xl overflow-hidden shadow-2xl"
      >

        {/* ── LEFT: dark photo panel with form ── */}
        <div className="relative flex-[1.1] flex flex-col overflow-hidden">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&h=1200&fit=crop"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay — same rich gradient as original code */}
          <div className="absolute inset-0 bg-gradient-to-t from-saree-charcoal/95 via-saree-charcoal/70 to-saree-charcoal/50" />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-7 pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-white/60 text-xs hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              Back
            </Link>
            <span className="text-white/50 text-xs tracking-wide">New customer</span>
          </div>

          {/* Form body */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-10 pt-6">
            <motion.div
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={formItemVariants}>
                <h1 className="font-display text-2xl font-bold text-white leading-tight mb-1">
                  Create your account
                </h1>
                <p className="text-white/45 text-xs mb-8">Join thousands of saree lovers</p>
              </motion.div>

              {errors.form && (
                <motion.div variants={formItemVariants} className="bg-red-500/20 border border-red-400/30 text-red-300 text-xs px-3 py-2 rounded-lg mb-5">
                  {errors.form}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Phone row */}
                <motion.div variants={formItemVariants} className="grid grid-cols-2 gap-5">
                  <UnderlineField
                    label="Full Name"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Priya Sharma"
                    error={errors.name}
                  />
                  <UnderlineField
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="9876543210"
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={formItemVariants}>
                  <UnderlineField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@email.com"
                    error={errors.email}
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={formItemVariants} className="relative">
                  <UnderlineField
                    label="Create password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 6 characters"
                    error={errors.password}
                    extraPadRight
                    className="w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-0 bottom-2.5 text-white/35 hover:text-white/70 transition-colors"
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </motion.div>

                {/* Confirm password */}
                <motion.div variants={formItemVariants}>
                  <UnderlineField
                    label="Confirm password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                    placeholder="Repeat your password"
                    error={errors.confirmPassword}
                  />
                </motion.div>

                {/* CTA — saree-rose is the brand accent */}
                <motion.div variants={formItemVariants}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-lg bg-saree-rose text-white text-sm font-semibold tracking-wide hover:bg-saree-rose/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Create Account 🌸'
                    )}
                  </button>
                </motion.div>

                <motion.p variants={formItemVariants} className="text-white/30 text-[10px] leading-relaxed pt-1">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-saree-rose/80 hover:text-saree-rose underline underline-offset-2">Terms</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-saree-rose/80 hover:text-saree-rose underline underline-offset-2">Privacy Policy</Link>.
                </motion.p>
              </form>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT: warm terracotta/saree-rose panel ── */}
        <div className="hidden lg:flex relative w-[38%] flex-col bg-saree-rose overflow-hidden">
          {/* Decorative background image (muted mountains/sky) */}
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-40"
          />

          {/* Warm tone wash */}
          <div className="absolute inset-0 bg-saree-rose/70" />

          {/* Top tab — "New customer" mirror */}
          <div className="relative z-10 flex justify-end">
            <div className="bg-saree-charcoal/25 text-white/70 text-xs px-5 py-3 rounded-bl-xl">
              New customer
            </div>
          </div>

          {/* Quote block — centered vertically */}
          <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 pb-16">
            {/* Giant decorative quote mark */}
            <span className="text-white/30 font-serif leading-none select-none mb-4"
              style={{ fontSize: '5rem', lineHeight: 1 }}>
              ❝
            </span>

            {/* Animated quote */}
            <div className="min-h-[100px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-accent text-white text-xl italic leading-snug"
                  style={{ fontStyle: 'italic' }}
                >
                  {QUOTES[quoteIdx].text}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dot pagination */}
            <div className="flex gap-2 mt-7">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIdx(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === quoteIdx
                      ? 'w-5 h-2 bg-white'
                      : 'w-2 h-2 bg-white/35 hover:bg-white/60'
                  }`}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom: already have account */}
          <div className="relative z-10 px-10 pb-8 text-right">
            <p className="text-white/60 text-xs">
              Already a customer?{' '}
              <Link to="/login" className="text-white font-bold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

/* ── Reusable underline-style input field ── */
function UnderlineField({ label, type, value, onChange, placeholder, error, extraPadRight }) {
  return (
    <div className="flex flex-col gap-0">
      <label className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          bg-transparent border-0 border-b text-white text-sm placeholder:text-white/20
          focus:outline-none focus:border-saree-rose pb-2 transition-colors w-full
          ${extraPadRight ? 'pr-6' : ''}
          ${error ? 'border-red-400/70' : 'border-white/20'}
        `}
      />
      {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
    </div>
  );
}