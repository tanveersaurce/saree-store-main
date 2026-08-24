import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About Us | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <Heart className="text-saree-rose" size={32} fill="currentColor" />
          About Us
        </h1>
        <p className="text-gray-500 text-sm mb-8">Saaj — Celebrating the timeless beauty of Indian handloom.</p>

        <div className="space-y-8 text-saree-charcoal">
          {/* Brand Philosophy */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">Our Philosophy</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              At <strong>Saaj</strong>, we believe that every saree tells a story — of craft, culture, and the women who wear them. 
              Our collection is a celebration of the rich, traditional handloom techniques passed down through generations of Indian weavers.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We are dedicated to bringing you authentic, premium sarees that represent India’s finest weaving heritage. Based in Bhopal, Madhya Pradesh, we serve saree enthusiasts across the country, providing them with access to high-quality silk, cotton, and linen sarees.
            </p>
          </section>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-saree-rose flex-shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-saree-charcoal text-sm mb-2">Supporting Handloom</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  We collaborate with skilled local weavers and artisans to promote sustainability, fair trade, and preserve traditional handloom art forms.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-saree-rose flex-shrink-0">
                <Star size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-saree-charcoal text-sm mb-2">Quality & Authenticity</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Every product undergoes strict inspection checking to ensure premium finishing, authentic materials, and complete customer satisfaction.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <section className="bg-gradient-to-r from-saree-rose to-saree-crimson rounded-2xl p-8 text-center text-white">
            <h2 className="font-display text-xl font-bold mb-2">Explore Our Collections</h2>
            <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
              Find the perfect handloom saree crafted for your special occasions, festivals, and elegant daily wear.
            </p>
            <Link to="/collections" className="px-6 py-3 bg-white text-saree-rose font-semibold rounded-full text-sm hover:bg-saree-blush transition-colors inline-block">
              Shop Now
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
