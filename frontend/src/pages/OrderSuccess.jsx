import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, Home, Calendar } from 'lucide-react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCartStore } from '../context/store';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(p || 0);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const { clearCart } = useCartStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['order-success', id],
    queryFn: () => orderAPI.getOne(id).then((r) => r.data),
    retry: false,
  });

  useEffect(() => {
    if (data?.order) {
      clearCart();
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [data, navigate, clearCart]);

  if (isLoading) return <LoadingSpinner fullPage />;

  if (error || !data?.order) {
    return (
      <div className="page-container py-20 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-3xl font-bold">!</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-saree-charcoal mb-2">Order Verification Failed</h1>
        <p className="text-gray-500 text-sm mb-6">
          We could not verify your order or the payment was unsuccessful.
        </p>
        <Link to="/cart" className="btn-primary">Return to Cart</Link>
      </div>
    );
  }

  const order = data.order;

  return (
    <>
      <Helmet><title>Order Success | Saaj</title></Helmet>
      <div className="page-container py-12 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-saree-charcoal mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-500 text-sm">
            Thank you for shopping with Saaj. Your order has been confirmed.
          </p>
          
          {/* Countdown redirect banner */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 text-saree-rose text-xs font-semibold rounded-full border border-pink-100/50">
            <span className="w-2 h-2 rounded-full bg-saree-rose animate-ping" />
            Redirecting to home page in {countdown} seconds...
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-5 mb-8">
          <div className="flex flex-wrap justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Order Number</p>
              <p className="text-sm font-bold text-saree-charcoal">#{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Order Date</p>
              <p className="text-sm text-gray-600 font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Amount</p>
              <p className="text-sm font-bold text-saree-rose">{formatPrice(order.totalPrice)}</p>
            </div>
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="text-xs font-bold text-saree-charcoal uppercase tracking-wider mb-2">Delivery Information</h3>
            <div className="text-xs text-gray-500 space-y-0.5">
              <p className="font-semibold text-gray-700">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
              <p className="text-gray-400 mt-1">📞 {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="text-xs font-bold text-saree-charcoal uppercase tracking-wider mb-3">Items Summary</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-saree-charcoal truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400">Qty: {item.quantity} {item.color ? `| Color: ${item.color}` : ''}</p>
                  </div>
                  <span className="text-xs font-bold text-saree-rose">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to={`/orders/${order._id}`} className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/" className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm">
            <Home size={16} /> Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}
