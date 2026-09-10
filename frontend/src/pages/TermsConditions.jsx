import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <FileText className="text-saree-rose" size={32} />
          Terms & Conditions
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-pink max-w-none text-saree-charcoal space-y-6">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing and purchasing from the <strong>Saaj</strong> website, you agree to follow and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">2. Account Responsibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              When you create an account on our platform, you are responsible for maintaining the confidentiality of your username, password, and active session tokens. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">3. Products & Pricing</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We make every effort to display the colors, fabrics, and descriptions of our handloom sarees as accurately as possible. However, actual handloom items may have minor variations in weave, texture, or color tone. 
              All prices listed on the website are in Indian Rupees (INR) and are inclusive of GST (unless stated otherwise). Saaj reserves the right to modify pricing, features, or product availability without prior notice.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">4. Order Placement & Acceptance</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Placing an order constitutes an offer to purchase the selected items. An order is only accepted once it is processed, verified, and shipped by Saaj. We reserve the right to cancel or reject any order for reasons including but not limited to incorrect pricing information, stock unavailability, or suspicious transaction activity.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">5. Payments & Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Online payments are securely routed via our trusted payment gateway partners (such as Easebuzz, Stripe, or Razorpay). All major cards, UPI, and Netbanking are accepted. Transactions must be authorized by the cardholder. We do not store any sensitive cardholder credentials on our servers. Cash on Delivery (COD) orders require successful verification before shipping.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">6. Cancellations, Returns & Refunds</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All requests for cancellations, returns, and refunds are governed strictly by our dedicated <strong>Cancellation & Refund Policy</strong> and <strong>Return & Replacement Policy</strong>. Please review these policies prior to completing your purchase.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All design elements, logos, product photographs, text content, and graphics on this website are the intellectual property of Saaj and are protected under Indian and international copyright laws. Any unauthorized use is strictly prohibited.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Saaj, its directors, and weavers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or from products purchased through it.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">9. Governing Law & Jurisdiction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts in Bhopal, Madhya Pradesh, India.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">10. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For any clarifications regarding these Terms & Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm space-y-1">
              <p><strong>Email:</strong> help@saajheritage.com</p>
              <p><strong>Phone:</strong> +91 98934 69426</p>
              <p><strong>Address:</strong> Bhopal, Madhya Pradesh, India</p>
            </div>
          </section>

          <div className="text-center text-xs text-gray-400 mt-10">
            Disclaimer: This document is written for compliance and informational purposes and does not constitute formal legal advice.
          </div>
        </div>
      </div>
    </>
  );
}
