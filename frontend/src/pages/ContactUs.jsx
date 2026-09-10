import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      toast.success('Your message has been sent successfully. We will get back to you soon!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <MessageSquare className="text-saree-rose" size={32} />
          Contact Us
        </h1>
        <p className="text-gray-500 text-sm mb-8">We are here to assist you. Get in touch with our customer support team.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-saree-rose flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-saree-charcoal text-sm mb-1">Email Us</h3>
                <a href="mailto:hello@saaj.com" className="text-gray-500 text-xs hover:text-saree-rose transition-colors">
                  hello@saaj.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-saree-rose flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-saree-charcoal text-sm mb-1">Call Us</h3>
                <a href="tel:+911800001234" className="text-gray-500 text-xs hover:text-saree-rose transition-colors">
                  +91 1800 001 234
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-saree-rose flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-saree-charcoal text-sm mb-1">Our Location</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Bhopal, Madhya Pradesh, India
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-card border border-gray-100">
              <h2 className="font-display text-lg font-bold text-saree-charcoal mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-saree-rose outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-saree-rose outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-saree-rose outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-saree-rose outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
