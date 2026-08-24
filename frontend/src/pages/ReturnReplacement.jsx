import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RotateCcw } from 'lucide-react';

export default function ReturnReplacement() {
  return (
    <>
      <Helmet>
        <title>Return & Replacement Policy | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <RotateCcw className="text-saree-rose" size={32} />
          Return & Replacement Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-pink max-w-none text-saree-charcoal space-y-6">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">1. Return Window</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We want you to love your saree. If you are not completely satisfied with your purchase, you can request a return or replacement within <strong>7 days</strong> from the date of order delivery.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">2. Return Eligibility & Product Condition</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              To be eligible for a return or replacement, the product must meet the following criteria:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>The saree must be unworn, unwashed, unstained, and in its original condition.</li>
              <li>All product tags, brand labels, and woven authenticity cards must be attached to the item.</li>
              <li>The item must be returned in its original product box/packaging along with the copy of the invoice.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4 text-saree-crimson">3. Damaged, Defective, or Wrong Items Received</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              If you receive a product that is damaged, defective, or different from what you ordered:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Please contact our customer support team within <strong>48 hours</strong> of delivery.</li>
              <li>You must provide <strong>proof of damage or difference</strong>, such as clear photographs or a short video clip showing the issue.</li>
              <li>Once verified, we will arrange for a priority reverse pickup and process a free replacement or a full refund at no additional cost.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">4. Replacement Process</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you wish to replace a product for reasons such as color preference or fabric choices, a replacement order will be dispatched to you once the returned item is successfully picked up, received at our warehouse, and passes our quality inspection checks. Replacements are subject to stock availability.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">5. Return Shipping & Pickups</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer reverse pickup facilities for most pin codes across India. If reverse pickup is not available for your location, we will request you to self-ship the product to our warehouse address, and we will reimburse reasonable return shipping charges (up to ₹100) upon receiving the tracking slip.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">6. Non-Returnable Products</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              The following products are strictly non-returnable and non-replaceable:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Sarees with customized blouse stitching or fall/pico work done on customer request.</li>
              <li>Gift cards or store vouchers.</li>
              <li>Products purchased during special flash sales or clearance events marked as "Non-Returnable".</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">7. Contact Support</h2>
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
