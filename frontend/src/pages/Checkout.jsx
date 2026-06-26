import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, Wallet, Truck, ChevronRight, Plus, Check, CheckCircle, ArrowRight } from 'lucide-react';
import { useCartStore, useAuthStore } from '../context/store';
import { orderAPI, paymentAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const STEPS = ['Address', 'Payment', 'Review'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const shipping = total >= 999 ? 0 : 99;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', label: 'Home' });
  const [showNewAddr, setShowNewAddr] = useState(false);
  const [showCodPopup, setShowCodPopup] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  useEffect(() => {
    if (user?.addresses?.length) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(def);
    } else {
      setShowNewAddr(true);
    }
  }, [user]);

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleRazorpay = async (orderId) => {
    try {
      const keyRes = await paymentAPI.getRazorpayKey();
      const rzpOrderRes = await paymentAPI.createRazorpayOrder(grandTotal);

      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyRes.data.key,
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: 'saaj',
          description: `Order #${orderId}`,
          order_id: rzpOrderRes.data.order.id,
          prefill: { name: user?.name, email: user?.email, contact: user?.phone },
          theme: { color: '#8b1a4a' },
          handler: async (response) => {
            try {
              await paymentAPI.verifyRazorpay(response);
              await orderAPI.pay(orderId, { ...response, status: 'paid' });
              resolve();
            } catch (err) { reject(err); }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      });
    } catch (err) {
      throw err;
    }
  };

  const handlePlaceOrder = async () => {
    const addr = selectedAddress || newAddress;
    if (!addr?.fullName || !addr?.addressLine1) { toast.error('Please select a delivery address'); return; }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({ product: i.product?._id || i.product, quantity: i.quantity, color: i.color })),
        shippingAddress: addr,
        paymentMethod,
      };

      const { data } = await orderAPI.create(orderPayload);
      const orderId = data.order._id;

      if (paymentMethod === 'razorpay') {
        await handleRazorpay(orderId);
        clearCart();
        navigate(`/order-success/${orderId}`);
      } else if (paymentMethod === 'cod') {
        setCreatedOrderId(orderId);
        setCreatedOrderNumber(data.order.orderNumber);
        setShowCodPopup(true);
        clearCart();
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled') toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.addAddress(newAddress);
      updateUser({ addresses: data.addresses });
      
      // Select the newly added address
      const newlyAdded = data.addresses[data.addresses.length - 1];
      setSelectedAddress(newlyAdded);
      
      toast.success('Address saved successfully!');
      setShowNewAddr(false);
      // Reset new address form fields
      setNewAddress({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', label: 'Home' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${i <= step ? 'text-saree-rose' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-saree-rose text-white' : i === step ? 'bg-saree-rose text-white ring-4 ring-pink-100' : 'bg-gray-100 text-gray-400'}`}>
              {i < step ? <Check size={12} /> : i + 1}
            </span>
            {s}
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px max-w-[60px] ${i < step ? 'bg-saree-rose' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <Helmet><title>Checkout | Saaj</title></Helmet>
      <div className="page-container py-10 max-w-5xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-saree-charcoal mb-6">Checkout</h1>
        <StepIndicator />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main steps */}
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-saree-charcoal flex items-center gap-2"><MapPin size={20} className="text-saree-rose" /> Delivery Address</h2>

                {user?.addresses?.map((addr) => (
                  <div key={addr._id} onClick={() => { setSelectedAddress(addr); setShowNewAddr(false); }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-saree-rose bg-pink-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${selectedAddress?._id === addr._id ? 'border-saree-rose bg-saree-rose' : 'border-gray-300'}`}>
                        {selectedAddress?._id === addr._id && <span className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-saree-charcoal">{addr.fullName}</p>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{addr.label}</span>
                          {addr.isDefault && <span className="text-xs bg-saree-blush text-saree-rose px-2 py-0.5 rounded-full font-medium">Default</span>}
                        </div>
                        <p className="text-gray-600 text-sm">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-gray-600 text-sm">{addr.city}, {addr.state} – {addr.pincode}</p>
                        <p className="text-gray-500 text-xs mt-0.5">📞 {addr.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new address toggle */}
                <button onClick={() => setShowNewAddr(!showNewAddr)} className="flex items-center gap-2 text-saree-rose font-semibold text-sm hover:underline">
                  <Plus size={15} /> Add New Address
                </button>

                {showNewAddr && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-2xl p-5 shadow-card space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[['Full Name', 'fullName', 'text', 'John Doe'], ['Phone', 'phone', 'tel', '9876543210']].map(([label, field, type, ph]) => (
                        <div key={field}>
                          <label className="input-label">{label}</label>
                          <input type={type} value={newAddress[field]} onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })} placeholder={ph} className="input-field" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="input-label">Address Line 1</label>
                      <input type="text" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} placeholder="House/Flat no, Street name" className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Address Line 2 (optional)</label>
                      <input type="text" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} placeholder="Landmark, Area" className="input-field" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[['City', 'city', 'Mumbai'], ['State', 'state', 'Maharashtra'], ['Pincode', 'pincode', '400001']].map(([label, field, ph]) => (
                        <div key={field}>
                          <label className="input-label">{label}</label>
                          <input type="text" value={newAddress[field]} onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })} placeholder={ph} className="input-field" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="input-label">Address Type (Label)</label>
                      <div className="flex gap-3 mb-4">
                        {['Home', 'Work', 'Other'].map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                            className={`py-1.5 px-4 rounded-xl text-xs font-semibold border-2 transition-all ${newAddress.label === lbl ? 'border-saree-rose bg-pink-50 text-saree-rose' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={handleAddNewAddress} disabled={loading}
                      className="btn-primary py-2 px-6 text-sm">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Save & Use This Address'
                      )}
                    </button>
                  </motion.div>
                )}

                <button onClick={() => setStep(1)} disabled={!selectedAddress} className="btn-primary w-full py-3.5 mt-4">
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-saree-charcoal flex items-center gap-2"><CreditCard size={20} className="text-saree-rose" /> Payment Method</h2>
                {[
                  { id: 'razorpay', label: 'Razorpay (Cards, UPI, Netbanking)', sub: 'Most secure & trusted', icon: '💳' },
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive your order', icon: '💵' },
                ].map((method) => (
                  <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === method.id ? 'border-saree-rose bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'border-saree-rose bg-saree-rose' : 'border-gray-300'}`}>
                      {paymentMethod === method.id && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-saree-charcoal">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.sub}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-secondary py-3 px-6">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Review Order <ChevronRight size={16} /></button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-saree-charcoal">Review Your Order</h2>
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <h3 className="font-semibold text-sm text-saree-charcoal mb-3">Delivering to</h3>
                  {selectedAddress && (
                    <div className="text-sm text-gray-600 space-y-0.5">
                      <p className="font-semibold text-saree-charcoal">{selectedAddress.fullName}</p>
                      <p>{selectedAddress.addressLine1}</p>
                      <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</p>
                      <p>📞 {selectedAddress.phone}</p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-card">
                  <h3 className="font-semibold text-sm text-saree-charcoal mb-3">Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex gap-3">
                        <img src={item.product?.images?.[0]?.url} alt={item.name} className="w-14 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-saree-charcoal line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-saree-rose">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary py-3 px-6">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3.5 text-base">
                    {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : `Place Order · ${formatPrice(grandTotal)}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="bg-white rounded-2xl p-5 shadow-card h-fit sticky top-24">
            <h3 className="font-display text-lg font-bold text-saree-charcoal mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
            </div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-saree-rose">{formatPrice(grandTotal)}</span></div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Truck size={12} className="text-saree-rose" />
              {shipping === 0 ? 'Free shipping applied!' : `Add ${formatPrice(999 - total)} for free shipping`}
            </div>
          </div>
        </div>
      </div>

      {/* COD Order Confirmation Popup */}
      <AnimatePresence>
        {showCodPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => navigate(`/order-success/${createdOrderId}`)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-gray-100 text-center"
            >
              {/* Success Checkmark Circle */}
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle size={40} className="text-green-500 animate-pulse" />
              </div>

              <h2 className="font-display text-2xl font-bold text-saree-charcoal mb-2">Order Confirmed! 🎉</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your beautiful sarees have been booked. Thank you for shopping with Saaj!
              </p>

              {/* Mini Summary Box */}
              <div className="bg-saree-blush/40 rounded-2xl p-4 mb-6 text-left border border-pink-100/50">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Order Number</span>
                  <span className="font-mono font-semibold text-saree-charcoal">{createdOrderNumber}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-saree-charcoal">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 border-t border-pink-100/50 pt-2 mt-2 font-bold text-sm">
                  <span className="text-saree-charcoal">Total Amount</span>
                  <span className="text-saree-rose">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/order-success/${createdOrderId}`)}
                className="btn-primary w-full py-3.5 text-base rounded-2xl flex items-center justify-center gap-2"
              >
                Track Order <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
