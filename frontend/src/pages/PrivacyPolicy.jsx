import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <Shield className="text-saree-rose" size={32} />
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-pink max-w-none text-saree-charcoal space-y-6">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">1. Introduction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome to <strong>Saaj</strong>. We value your trust and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, and share your personal data when you visit our website, register an account, and make purchases.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              When you use our website, we may collect the following types of personal information:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, mobile/phone number, billing address, and shipping address.</li>
              <li><strong>Order History:</strong> Details of sarees purchased, order dates, transaction history, and loyalty points earned.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device details, page view history, and general analytics data.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4 text-saree-crimson">3. Payment Information Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We process online payments securely through authorized payment gateway partners (such as Easebuzz, Stripe, or Razorpay). 
              <strong> Please note:</strong> Saaj does <strong>NOT</strong> directly store, collect, or process your credit card numbers, debit card numbers, CVV, expiry dates, net banking credentials, UPI PINs, or passwords. All payment transactions are securely encrypted and processed directly through the payment gateway's secure environment.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">4. How We Use Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We use the collected information for the following business purposes:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Processing orders, shipping products, and managing returns/refunds.</li>
              <li>Verifying your identity, managing your account, and tracking loyalty points.</li>
              <li>Sending order confirmation emails, delivery updates, and promotional communications (if requested).</li>
              <li>Improving our website performance, security, and customer support.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">5. Data Sharing & Third Parties</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We share your data with trusted third parties only to facilitate our services:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li><strong>Payment Processors:</strong> To complete transaction verifications and online payments.</li>
              <li><strong>Logistics & Shipping Partners:</strong> To print shipping labels, deliver shipments, and track packages.</li>
              <li><strong>Hosting & Analytics Providers:</strong> To securely store databases and monitor website traffic.</li>
              <li><strong>Legal Authorities:</strong> If required by Indian law or to protect our rights and user safety.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">6. Cookies & Tracking Technologies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use cookies and similar tracking tools to optimize website navigation, store items in your cart, remember search filters, and analyze web traffic. You can choose to disable cookies through your browser settings, though some website features (like adding items to cart) may not function fully.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">7. Data Retention & User Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We retain customer account and purchase data as long as necessary to comply with financial audits, taxation, and legal regulations in India. Customers have the right to request access to their personal data, correct inaccuracies, or request account deletion by contacting us.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">8. Contact Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact our support team at:
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
