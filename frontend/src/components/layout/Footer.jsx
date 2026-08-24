import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram, Facebook, Youtube, Twitter,
  MapPin, Phone, Mail, Heart, ChevronDown,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const footerLinks = {
  shop: [
    { name: 'New Arrivals',     href: '/collections?filter=new' },
    { name: 'Best Sellers',     href: '/collections?filter=bestseller' },
    { name: 'Bridal Collection',href: '/collections/bridal-sarees' },
    { name: 'Sale',             href: '/sale' },
    { name: 'All Collections',  href: '/collections' },
  ],
  help: [
    { name: 'Shipping Policy',          href: '/shipping-policy' },
    { name: 'Cancellation & Refund',    href: '/cancellation-refund-policy' },
    { name: 'Return & Replacement',     href: '/return-replacement-policy' },
    { name: 'Privacy Policy',           href: '/privacy-policy' },
    { name: 'Terms & Conditions',       href: '/terms-and-conditions' },
  ],
  company: [
    { name: 'About Us',                 href: '/about-us' },
    { name: 'Contact Us',               href: '/contact-us' },
    { name: 'Our Weavers',              href: '/weavers' },
    { name: 'Sustainability',           href: '/sustainability' },
    { name: 'Track Order',              href: '/orders' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400 hover:bg-pink-500/20' },
  { icon: Facebook,  href: '#', label: 'Facebook',  color: 'hover:text-blue-400 hover:bg-blue-500/20'  },
  { icon: Youtube,   href: '#', label: 'YouTube',   color: 'hover:text-red-400  hover:bg-red-500/20'   },
  { icon: Twitter,   href: '#', label: 'Twitter',   color: 'hover:text-sky-400  hover:bg-sky-500/20'   },
];

const paymentMethods = ['Visa', 'Mastercard', 'UPI', 'Razorpay', 'Net Banking', 'COD'];

// ─── Mobile Accordion Link Section ────────────────────────────────────────────
function AccordionSection({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      {/* Header — clickable on mobile/tablet */}
      <button
        className="flex items-center justify-between w-full py-4 text-left md:cursor-default"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm uppercase tracking-wider">
          {title}
        </span>
        {/* Arrow only shows on mobile & tablet */}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 lg:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Links — always visible on desktop, accordion on mobile/tablet */}
      <ul
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:max-h-none lg:opacity-100 lg:pb-6 ${
          open ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
        }`}
      >
        {links.map((link) => (
          <li key={link.name} className="mb-2.5 last:mb-0">
            <Link
              to={link.href}
              className="text-gray-400 text-sm hover:text-saree-crimson transition-colors duration-200 hover:pl-1"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="bg-saree-charcoal text-white mt-auto">

      {/* ── Newsletter Strip ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-saree-rose to-saree-crimson">
        <div className="page-container py-8 md:py-10">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">

            {/* Text */}
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1">
                Stay in the Loop 🌸
              </h3>
              <p className="text-white/80 text-xs md:text-sm">
                Exclusive offers, new arrivals & styling tips — straight to your inbox.
              </p>
            </div>

            {/* Input */}
            <form
              className="flex w-full max-w-sm md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 px-4 py-2.5 md:py-3 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/60 text-sm outline-none focus:bg-white/30 transition-colors"
              />
              <button
                type="submit"
                className="px-4 md:px-5 py-2.5 md:py-3 bg-white text-saree-rose font-semibold rounded-full text-sm hover:bg-saree-blush transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Body ────────────────────────────────────────────────────────── */}
      <div className="page-container pt-10 pb-6 md:pt-12 md:pb-8 lg:pt-14 lg:pb-10">

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-10">

          {/* ── Brand Column ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 pb-6 md:pb-8 lg:pb-0 border-b border-white/10 lg:border-none">

            {/* Logo + tagline */}
            <Link to="/" className="inline-flex flex-col mb-4">
              <span className="font-display text-3xl font-bold text-saree-crimson">Saaj</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Celebrating the timeless beauty of Indian handloom. Every saree tells
              a story — of craft, culture, and the women who wear them.
            </p>

            {/* Social row */}
            <div className="flex gap-2.5 mb-5">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 transition-all duration-200 ${color}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact info — 2-col on mobile/tablet for compactness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <a
                href="mailto:hello@saaj.com"
                className="flex items-center gap-2 text-gray-400 text-sm hover:text-saree-crimson transition-colors"
              >
                <Mail size={13} className="text-saree-rose/60 flex-shrink-0" />
                hello@saaj.com
              </a>
              <a
                href="tel:+911800001234"
                className="flex items-center gap-2 text-gray-400 text-sm hover:text-saree-crimson transition-colors"
              >
                <Phone size={13} className="text-saree-rose/60 flex-shrink-0" />
                +91 1800 001 234
              </a>
              <span className="flex items-center gap-2 text-gray-400 text-sm sm:col-span-2 lg:col-span-1">
                <MapPin size={13} className="text-saree-rose/60 flex-shrink-0" />
                Bhopal, Madhya Pradesh, India
              </span>
            </div>
          </div>

          {/* ── Link Columns ───────────────────────────────────────────────── */}
          {/* On mobile: full-width accordion stacked
              On tablet: 3-column grid
              On desktop: each in its own column (handled by parent grid) */}
          <div className="lg:contents">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:contents gap-0 sm:gap-8 mt-2 lg:mt-0">
              <AccordionSection title="Shop"        links={footerLinks.shop}    />
              <AccordionSection title="Help & Info" links={footerLinks.help}    />
              <AccordionSection title="Company"     links={footerLinks.company} />
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ─────────────────────────────────────────────────────── */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">

            {/* Copyright */}
            <p className="text-gray-500 text-xs text-center sm:text-left order-2 sm:order-1">
              © {new Date().getFullYear()} Saaj. All rights reserved. Made with{' '}
              <Heart size={10} className="inline text-saree-rose" fill="currentColor" />{' '}
              in India.
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-2 flex-wrap justify-center order-1 sm:order-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-white/10 rounded-md text-gray-400 text-xs font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Mobile bottom nav safe-area spacer ──────────────────────────────── */}
      {/* Agar bottom navigation bar use kar rahe ho toh yeh space deta hai */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

    </footer>
  );
}