import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <Truck className="text-saree-rose" size={32} />
          Shipping & Delivery Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-pink max-w-none text-saree-charcoal space-y-6">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">1. Delivery Locations</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Saaj</strong> ships sarees to most pin codes across India. We partner with reliable courier services to ensure your items are handled with care and delivered securely.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">2. Processing Time</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All orders are processed and prepared for shipping within <strong>1 to 2 business days</strong> after payment verification. Orders are not processed or shipped on Sundays and national holidays.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">3. Estimated Delivery Timelines</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Once shipped, the estimated delivery timelines are:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li><strong>Metros & Major Cities:</strong> 3 to 5 business days.</li>
              <li><strong>Other Cities & Towns:</strong> 5 to 7 business days.</li>
              <li><strong>Remote Areas:</strong> 7 to 10 business days.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">4. Shipping Charges</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer <strong>Free Shipping</strong> on all orders within India with a total value of <strong>₹999 and above</strong>. For orders below ₹999, a flat shipping charge of <strong>₹99</strong> is added during checkout.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">5. Tracking Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Once your shipment is dispatched, you will receive an email and SMS containing the tracking number and link to the logistics provider's website. You can also track your order status directly under your profile's "My Orders" tab on our website.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">6. Delivery Attempts & Customer Responsibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              It is the customer's responsibility to provide the complete and correct delivery address along with an active phone number. 
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Our logistics partners will attempt delivery up to <strong>3 times</strong>.</li>
              <li>If the delivery fails due to incorrect address details, no recipient available, or refusal of delivery, the package will be returned to our warehouse. Additional shipping charges may apply to re-ship the order.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">7. Delays & Damages</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              While we strive to deliver orders within the estimated timelines, delays may occasionally occur due to extreme weather conditions, national strikes, public festivals, or unexpected logistics disruptions. 
              If your order package is visibly damaged or tampered with at the time of delivery, please refuse to accept it and contact us immediately at <strong>hello@saaj.com</strong>.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">8. Customer Support</h2>
            <div className="p-4 bg-gray-50 rounded-xl text-sm space-y-1">
              <p><strong>Email:</strong> hello@saaj.com</p>
              <p><strong>Phone:</strong> +91 1800 001 234</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
