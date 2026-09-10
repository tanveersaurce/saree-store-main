import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../context/store';

const QUOTES = [
  { text: 'Every saree is a love letter written in threads.', author: 'Saaj Atelier' },
  { text: 'Elegance is not about being noticed, it is about being remembered.', author: 'Giorgio Armani' },
  { text: 'Wear what makes your soul smile.', author: 'Unknown' },
];

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.12 }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, loading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [quoteIdx, setQuoteIdx] = useState(0);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(form.email, form.password);
    if (result.success) navigate(redirect, { replace: true });
    else setErrors({ form: result.message });
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const registerLink = redirect !== '/' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register';

  return (
    <div className="min-h-screen bg-saree-blush flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        // FIX: Mobile pe full width single col, lg pe two-col side by side
        className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl"
      >

        {/* ── LEFT: dark photo panel with form ── */}
        {/* FIX: Mobile pe w-full, lg pe flex-[1.1] */}
        <div className="relative w-full lg:flex-[1.1] flex flex-col overflow-hidden min-h-[600px] sm:min-h-[640px]">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&h=1200&fit=crop"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* FIX: Overlay aur dark banaya mobile pe taaki text clearly dikhe */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/65" />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-white/70 text-xs hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              Back
            </Link>
            <span className="text-white/50 text-xs tracking-wide">Returning customer</span>
          </div>

          {/* Form body */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-8 pb-6 pt-4">
            <motion.div
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={formItemVariants}>
                {/* FIX: Heading clearly white with stronger contrast */}
                <h1 className="font-display text-2xl font-bold text-white leading-tight mb-1">
                  Welcome back
                </h1>
                {/* FIX: Subtitle opacity raised for readability */}
                <p className="text-white/60 text-xs mb-6 sm:mb-8">Sign in to your Saaj account</p>
              </motion.div>

              {/* Error message */}
              {errors.form && (
                <motion.div variants={formItemVariants} className="bg-red-500/20 border border-red-400/30 text-red-300 text-xs px-3 py-2 rounded-lg mb-5">
                  {errors.form}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                <motion.div variants={formItemVariants}>
                  <div className="flex items-center justify-between mb-1.5">
                    {/* FIX: Label text opacity raised */}
                    <label className="text-white/60 text-[10px] uppercase tracking-widest">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[10px] text-saree-rose hover:text-saree-rose/80 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="••••••••"
                      className={`
                        bg-transparent border-0 border-b text-white text-sm placeholder:text-white/30
                        focus:outline-none focus:border-saree-rose pb-2 transition-colors w-full pr-6
                        ${errors.password ? 'border-red-400/70' : 'border-white/30'}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-0 bottom-2.5 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
                </motion.div>

                {/* CTA */}
                <motion.button
                  variants={formItemVariants}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-saree-rose text-white text-sm font-semibold tracking-wide hover:bg-saree-rose/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              {/* Demo credentials
              <motion.div variants={formItemVariants} className="mt-5 sm:mt-6 p-3 rounded-lg border border-white/15 bg-white/8">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                  Demo Credentials
                </p>

                <p className="text-white/55 text-[11px]">Admin: admin@saaj.com / admin@123</p>
                <p className="text-white/55 text-[11px]">User: priya@example.com / user@123</p>
              </motion.div> */}

              {/* FIX: "Create account" link — mobile & tablet pe yahan dikhta hai (lg pe right panel me hai) */}
              <motion.div variants={formItemVariants} className="mt-5 text-center lg:hidden">
                <p className="text-white/55 text-xs">
                  New to Saaj?{' '}
                  <Link to={registerLink} className="text-white font-bold hover:underline underline-offset-2">
                    Create account
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT: warm saree-rose panel — desktop only ── */}
        <div className="hidden lg:flex relative w-[38%] flex-col bg-saree-rose overflow-hidden">
          {/* Soft background image */}
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-40"
          />
          <div className="absolute inset-0 bg-saree-rose/70" />

          {/* Top tab label */}
          <div className="relative z-10 flex justify-end">
            <div className="bg-saree-charcoal/25 text-white/70 text-xs px-5 py-3 rounded-bl-xl">
              Returning customer
            </div>
          </div>

          {/* Quote block */}
          <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 pb-16">
            <span
              className="text-white/30 font-serif select-none mb-4"
              style={{ fontSize: '5rem', lineHeight: 1 }}
            >
              ❝
            </span>

            <div className="min-h-[100px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white text-xl italic leading-snug font-accent"
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

          {/* Bottom: create account link */}
          <div className="relative z-10 px-10 pb-8 text-right">
            <p className="text-white/70 text-xs">
              New to Saaj?{' '}
              <Link to={registerLink} className="text-white font-bold hover:underline underline-offset-2">
                Create account
              </Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

/* ── Reusable underline-style input ── */
function UnderlineField({ label, type, value, onChange, placeholder, error }) {
  return (
    <div className="flex flex-col">
      {/* FIX: Label opacity raised */}
      <label className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          bg-transparent border-0 border-b text-white text-sm placeholder:text-white/30
          focus:outline-none focus:border-saree-rose pb-2 transition-colors w-full
          ${error ? 'border-red-400/70' : 'border-white/30'}
        `}
      />
      {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
    </div>
  );
}