import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Heart, ShoppingBag, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Share2, Check, ChevronDown, Minus, Plus, Maximize2
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCartStore, useWishlistStore } from '../context/store';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function ProductDetail() {
  const { slug } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [expandedSection, setExpandedSection] = useState('description');
  const [adding, setAdding] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { addToCart } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productAPI.getOne(slug).then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error || !data?.product) return (
    <div className="page-container py-20 text-center">
      <h2 className="font-display text-2xl text-gray-400 mb-4">Product not found</h2>
      <Link to="/collections" className="btn-primary">Browse Collections</Link>
    </div>
  );

  const { product, reviews, related } = data;
  const images = product.images?.length ? product.images : [{ url: 'https://via.placeholder.com/600x750', alt: product.name }];
  const effectivePrice = product.discountPrice || product.price;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity, selectedColor);
    setAdding(false);
  };

  const checkPincode = () => {
    if (pincode.length !== 6) { toast.error('Enter a valid 6-digit pincode'); return; }
    setPincodeMsg('✅ Delivery available in 5–7 business days');
  };

  const AccordionSection = ({ id, title, children }) => (
    <div className="border-b border-gray-100">
      <button
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-saree-charcoal hover:text-saree-rose transition-colors"
        onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${expandedSection === id ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-4 text-sm text-gray-600 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{product.name} | SareeSaanvi</title>
        <meta name="description" content={product.shortDescription || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="page-container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 uppercase tracking-wider font-semibold">
          <Link to="/" className="hover:text-saree-rose transition-colors">Home</Link>
          <span className="text-gray-300">›</span>
          <Link to="/collections" className="hover:text-saree-rose transition-colors">Collections</Link>
          <span className="text-gray-300">›</span>
          <Link to={`/collections/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-saree-rose transition-colors">{product.category}</Link>
          <span className="text-gray-300">›</span>
          <span className="text-saree-charcoal line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT SIDE — Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails stack on far left */}
            {images.length > 1 && (
              <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-20 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 md:w-full md:h-auto md:aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImg === i ? 'border-saree-rose ring-2 ring-saree-rose/10 scale-[1.02]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image container */}
            <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-saree-blush group shadow-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]?.url}
                  alt={images[activeImg]?.alt || product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Wishlist + Share at top right */}
              <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-10">
                <button
                  onClick={() => toggle(product._id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    wishlisted
                      ? 'bg-saree-rose text-white scale-105'
                      : 'bg-white/90 text-gray-400 hover:text-saree-rose hover:bg-white hover:scale-105'
                  }`}
                >
                  <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => {
                    navigator.share?.({ title: product.name, url: window.location.href }) ||
                      navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied!'));
                  }}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-400 hover:text-saree-rose hover:scale-105 transition-all duration-300"
                >
                  <Share2 size={16} />
                </button>
              </div>

              {/* Zoom / Fullscreen at bottom right */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-500 hover:text-saree-rose hover:scale-105 transition-all duration-300 z-10"
              >
                <Maximize2 size={16} />
              </button>

              {/* Discount badge */}
              {product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 badge-sale font-bold">{product.discountPercent}% OFF</div>
              )}

              {/* Navigation arrows (if more than 1 image) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — Product Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tag, Name, Brand */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-saree-rose mb-1.5">
                {product.fabric} · {product.category}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-saree-charcoal leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-400 text-xs mt-1.5 font-medium tracking-wide">
                By {product.brand} · Origin: {product.origin}
              </p>
            </div>

            {/* Rating inline */}
            <div className="flex items-center gap-2.5 pb-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={15}
                    className={s <= Math.round(product.ratings || 0) ? 'text-amber-400' : 'text-gray-200'}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="font-bold text-sm text-saree-charcoal">{product.ratings || '0.0'}</span>
              <span className="text-gray-400 text-sm">({product.numReviews || 0} reviews)</span>
            </div>

            {/* Price row */}
            <div className="border-t border-b border-gray-100 py-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-bold text-saree-rose">{formatPrice(effectivePrice)}</span>
                {product.discountPrice && (
                  <>
                    <span className="text-gray-400 line-through text-lg font-medium">{formatPrice(product.price)}</span>
                    <span className="bg-saree-rose text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">Inclusive of all taxes · GST included</p>
            </div>

            {/* Color variants */}
            {product.variants?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-saree-charcoal mb-2.5">
                  Color: <span className="text-gray-500 font-normal">{selectedColor || 'Select a color'}</span>
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedColor(v.color)}
                      title={v.color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === v.color
                          ? 'border-saree-rose scale-110 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    >
                      {selectedColor === v.color && <Check size={12} className="mx-auto text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY & ADD TO BAG (Side-by-side) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-saree-charcoal">Quantity</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    product.stock === 0
                      ? 'bg-red-50 text-red-600'
                      : product.stock <= 5
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-green-50 text-green-600'
                  }`}
                >
                  {product.stock === 0 ? '❌ Out of stock' : product.stock <= 5 ? `⚡ Only ${product.stock} left` : `✓ In stock`}
                </span>
              </div>
              
              <div className="flex items-center gap-3 w-full">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 hover:bg-gray-50 transition-colors text-gray-500 font-semibold"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-4 py-3 font-semibold text-saree-charcoal min-w-[36px] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-3 hover:bg-gray-50 transition-colors text-gray-500 font-semibold"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Add to Bag button */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
                  className="flex-1 btn-primary py-3.5 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-saree-rose/10 hover:shadow-saree-rose/25 transition-all"
                >
                  {adding ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingBag size={16} />
                  )}
                  {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
              </div>
            </div>

            {/* CHECK DELIVERY section */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-saree-charcoal mb-2.5 flex items-center gap-2">
                <Truck size={15} className="text-saree-rose" /> Check Delivery
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setPincodeMsg('');
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="input-field py-2.5 text-sm flex-1 bg-white border-gray-200"
                />
                <button
                  onClick={checkPincode}
                  className="btn-secondary py-2.5 px-5 text-sm font-semibold hover:bg-saree-rose hover:text-white transition-colors"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && <p className="text-green-600 text-xs mt-2 font-medium">{pincodeMsg}</p>}
            </div>

            {/* 3 Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: '100% Authentic', sub: 'Silk Mark certified' },
                { icon: RotateCcw, text: 'Easy Returns', sub: '7-day policy' },
                { icon: Truck, text: 'Fast Delivery', sub: '3–7 business days' },
              ].map(({ icon: Icon, text, sub }) => (
                <div
                  key={text}
                  className="flex flex-col items-center text-center p-3 bg-saree-blush/40 rounded-2xl border border-saree-blush/60 gap-1 transition-all hover:scale-[1.02]"
                >
                  <Icon size={18} className="text-saree-rose" />
                  <p className="text-xs font-bold text-saree-charcoal mt-1">{text}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{sub}</p>
                </div>
              ))}
            </div>

            {/* Accordion: Description, Product Details, Shipping & Returns */}
            <div className="border-t border-gray-100 pt-2">
              <AccordionSection id="description" title="Description">
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </AccordionSection>

              <AccordionSection id="details" title="Product Details">
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
                  {[
                    ['Fabric', product.fabric],
                    ['Length', `${product.sareeLength}m`],
                    ['Blouse', product.blouseIncluded ? `Included (${product.blouseLength}m)` : 'Not included'],
                    ['Care', product.careInstructions],
                    ['Origin', product.origin],
                    ['Weight', `${product.weight}g`],
                  ].map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span className="font-semibold text-gray-400">{k}</span>
                      <span className="text-gray-700 font-medium">{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              </AccordionSection>

              <AccordionSection id="shipping" title="Shipping & Returns">
                <ul className="space-y-1.5 list-disc list-inside text-gray-600 text-sm">
                  <li>Free shipping on orders above ₹999</li>
                  <li>Standard delivery: 5–7 business days</li>
                  <li>Express delivery available at checkout</li>
                  <li>7-day easy return policy</li>
                  <li>Exchange available within 15 days</li>
                </ul>
              </AccordionSection>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews?.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-saree-charcoal mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={review.user?.avatar?.url}
                      alt={review.user?.name}
                      className="w-10 h-10 rounded-full object-cover bg-saree-blush"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-saree-charcoal">{review.user?.name}</p>
                        {review.isVerifiedPurchase && (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <Check size={11} /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={s <= review.rating ? 'text-amber-400' : 'text-gray-200'}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-saree-charcoal mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related?.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-saree-charcoal mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl transition-all duration-300 font-semibold"
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[activeImg]?.url}
              alt={images[activeImg]?.alt || product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
