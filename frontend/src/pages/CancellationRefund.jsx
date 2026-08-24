import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCw } from 'lucide-react';

export default function CancellationRefund() {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy | Saaj</title>
      </Helmet>
      <div className="page-container py-10 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-saree-charcoal mb-4 flex items-center gap-3">
          <RefreshCw className="text-saree-rose" size={32} />
          Cancellation & Refund Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: August 24, 2026</p>

        <div className="prose prose-pink max-w-none text-saree-charcoal space-y-6">
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">1. Order Cancellation by Customer</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We understand that plans can change. You can request to cancel your order subject to the following rules:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li><strong>Before Shipping:</strong> You can cancel your order directly from your profile's "My Orders" page or by contacting customer support before the order status is marked as "Shipped". In this case, we will initiate a 100% refund.</li>
              <li><strong>After Shipping:</strong> Orders cannot be cancelled once they have been handed over to the courier partner and shipped. If you refuse delivery, refund is subject to return transit cost deductions.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">2. Order Cancellation by Saaj</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Occasionally, we may have to cancel an order due to factors such as stock unavailability, incorrect product description, pricing errors on the website, or issues flagged by our payment verification systems. If we cancel your order, you will be notified, and a full refund will be processed immediately.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">3. Refund Eligibility & Method</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Refunds are issued to the original payment source (credit/debit card, net banking account, or UPI handle) used during order placement. For Cash on Delivery (COD) order returns, refunds are initiated via bank transfer or store credits after verifying the customer's bank details.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">4. Refund Processing Timeline</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Once a refund is approved and initiated by Saaj, it typically takes <strong>5 to 7 business days</strong> for the amount to reflect in your source account, depending on your bank's clearance cycles and payment gateway networks.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">5. Payment Gateway Failures</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If an amount is debited from your account due to a network timeout or connection failure, but the order is not placed (payment failure status), the payment gateway will automatically reverse the transaction and credit the amount back to your account within <strong>24 to 48 hours</strong>.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100">
            <h2 className="font-display text-xl font-bold text-saree-charcoal mb-4">6. Non-Refundable Items & Cases</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Refunds are not processed under the following circumstances:
            </p>
            <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
              <li>Customized stitching or blouse modifications requested by the customer.</li>
              <li>Used, washed, stained, or dry-cleaned products.</li>
              <li>Products returned without their original tags, invoice, or packaging elements intact.</li>
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
