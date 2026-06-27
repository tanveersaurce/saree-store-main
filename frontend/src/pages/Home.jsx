import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { productAPI, bannerAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import banner from '../components/images/banner.png'

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const FALLBACK_CATEGORIES = {
  Bagh: { emoji: '💮', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop' },
  Batik: { emoji: '🎨', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop' },
  Bagru: { emoji: '🏺', image: 'https://imgs.search.brave.com/JQAJvr47DXRUg4wPpY_9vOo94PIW6pNL3elWH_bEIsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaGlk/aXlhYS5jb20vY2Ru/L3Nob3AvZmlsZXMv/aW1nXzE4NTYuanBn/P3Y9MTc0NjAxNjc0/MSZ3aWR0aD0yMzI4' },
  Chanderi: { emoji: '🌸', image: 'https://imgs.search.brave.com/JKKLwF-VowSj8EFFlCF9SPfFOTROu75fqbmab-AoUBU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Ymlzd2FiYW5nbGEu/aW4vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjYvMDQvMzU1NDVf/RFNDXzYwMjhfQmlz/d2EtQmFuZ2xhLTQw/MHg2MTcud2VicA' },
  Dabu: { emoji: '🌿', image: 'https://imgs.search.brave.com/6ece-6xPvT97g8UiUq60EKmkO8oGte1mv5oZaoHNa08/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMwLm1pcnJhdy5j/b20vaW1hZ2VzLzEy/OTM0MTg3L2dyZWVu/XzFfbG9uZy5KUEc_/MTczMDIwMTk1MA' },
  'Zari-Zardozi': { emoji: '✨', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop' },
  Kalamkari: { emoji: '🖋️', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop' },
  Ajrakh: { emoji: '🏵️', image: 'https://imgs.search.brave.com/JQAJvr47DXRUg4wPpY_9vOo94PIW6pNL3elWH_bEIsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaGlk/aXlhYS5jb20vY2Ru/L3Nob3AvZmlsZXMv/aW1nXzE4NTYuanBn/P3Y9MTc0NjAxNjc0/MSZ3aWR0aD0yMzI4' },
  Bandhani: { emoji: '🎈', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop' },
  Leheriya: { emoji: '〰️', image: 'https://imgs.search.brave.com/6ece-6xPvT97g8UiUq60EKmkO8oGte1mv5oZaoHNa08/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMwLm1pcnJhdy5j/b20vaW1hZ2VzLzEy/OTM0MTg3L2dyZWVu/XzFfbG9uZy5KUEc_/MTczMDIwMTk1MA' },

  // Fabrics
  Bridal: { emoji: '👰', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop' },
  Silk: { emoji: '✨', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop' },
  Designer: { emoji: '💎', image: 'https://imgs.search.brave.com/JQAJvr47DXRUg4wPpY_9vOo94PIW6pNL3elWH_bEIsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaGlk/aXlhYS5jb20vY2Ru/L3Nob3AvZmlsZXMv/aW1nXzE4NTYuanBn/P3Y9MTc0NjAxNjc0/MSZ3aWR0aD0yMzI4' },
  Cotton: { emoji: '🌿', image: 'https://imgs.search.brave.com/JKKLwF-VowSj8EFFlCF9SPfFOTROu75fqbmab-AoUBU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Ymlzd2FiYW5nbGEu/aW4vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjYvMDQvMzU1NDVf/RFNDXzYwMjhfQmlz/d2EtQmFuZ2xhLTQw/MHg2MTcud2VicA' },
  Banarasi: { emoji: '🏛️', image: 'https://imgs.search.brave.com/6ece-6xPvT97g8UiUq60EKmkO8oGte1mv5oZaoHNa08/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMwLm1pcnJhdy5j/b20vaW1hZ2VzLzEy/OTM0MTg3L2dyZWVu/XzFfbG9uZy5KUEc_/MTczMDIwMTk1MA' },
  Casual: { emoji: '🌸', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop' },
};

const getCategoryMeta = (cat) => {
  const nameKey = cat.name.trim();
  const defaults = FALLBACK_CATEGORIES[nameKey] || FALLBACK_CATEGORIES[nameKey.split(' ')[0]] || {
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop'
  };
  return {
    emoji: cat.icon || defaults.emoji,
    image: cat.image?.url || defaults.image
  };
};

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Shield, title: '100% Authentic', desc: 'Certified handloom & silk mark', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Star, title: 'Premium Quality', desc: 'Curated by textile experts', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai', text: 'The Kanjivaram saree I ordered was absolutely stunning! The quality is exceptional and delivery was super fast.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
  { name: 'Ananya Reddy', location: 'Hyderabad', text: "My bridal saree from Saaj was breathtaking. Every guest complimented me. Couldn't be happier!", rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { name: 'Kavitha Nair', location: 'Kochi', text: 'Beautiful handloom collection. Love how they preserve traditional weaving techniques while making it accessible.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' },
];

// Skeleton for product grid
const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden">
    <div className="skeleton aspect-card" />
    <div className="p-3.5 space-y-2">
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('featured');
  const printScrollRef = useRef(null);
  const fabricScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ['banners', 'hero'],
    queryFn: () => bannerAPI.get('hero').then((r) => r.data.banners),
    staleTime: 10 * 60 * 1000,
  });

  const { data: homepage, isLoading: productsLoading } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => productAPI.getHomepage().then((r) => r.data),
  });

  const tabProducts = {
    featured: homepage?.featured || [],
    trending: homepage?.trending || [],
    new: homepage?.newArrivals || [],
    bestseller: homepage?.bestSellers || [],
  };

  const GRADIENTS = [
    'from-rose-100 to-pink-200',
    'from-amber-100 to-yellow-200',
    'from-purple-100 to-violet-200',
    'from-green-100 to-emerald-200',
    'from-blue-100 to-indigo-200',
    'from-pink-100 to-rose-200'
  ];

  const { data: printCategoriesData } = useQuery({
    queryKey: ['categories', 'print'],
    queryFn: () => categoryAPI.getAll({ type: 'print' }).then((r) => r.data.categories),
  });
  const printCategories = printCategoriesData || [];

  const { data: fabricCategoriesData } = useQuery({
    queryKey: ['categories', 'fabric'],
    queryFn: () => categoryAPI.getAll({ type: 'fabric' }).then((r) => r.data.categories),
  });
  const fabricCategories = fabricCategoriesData || [];

  const prepareMarqueeList = (list) => {
    if (!list || list.length === 0) return [];
    const repeats = Math.ceil(18 / list.length);
    let result = [];
    for (let r = 0; r < repeats; r++) {
      result = [...result, ...list.map((item, idx) => ({ ...item, uniqueKey: `${item._id || idx}-${r}` }))];
    }
    return result;
  };

  const printMarqueeItems = prepareMarqueeList(printCategories);
  const fabricMarqueeItems = prepareMarqueeList(fabricCategories);

  const fallbackBanners = [
    { _id: '1', title: 'New Bridal Collection 2025', subtitle: 'Crafted for Your Moment', description: 'Discover exclusive bridal sarees from India\'s finest weavers', link: '/collections/bridal-sarees', buttonText: 'Explore Bridal', bgColor: '#2d1b3d', textColor: '#f8e8f0', image: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&h=700&fit=crop' } },
    { _id: '2', title: 'Monsoon Sale — Up to 40% Off', subtitle: 'Limited Time Only', description: 'Shop premium sarees at unbeatable prices. Offer ends soon!', link: '/sale', buttonText: 'Shop Sale', bgColor: '#8b1a4a', textColor: '#fdf8f5', image: { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&h=700&fit=crop' } },
    { _id: '3', title: 'Handloom Heritage', subtitle: 'Where Tradition Meets Fashion', description: 'Authentic handwoven sarees directly from artisan families', link: '/collections/handloom-sarees', buttonText: 'Discover Handloom', bgColor: '#4a2c2a', textColor: '#fef6ee', image: { url: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=1400&h=700&fit=crop' } },
  ];

  const displayBanners = (banners?.length > 0) ? banners : fallbackBanners;

  return (
    <>
      <Helmet>
        <title>Saaj — Premium Handloom & Silk Sarees Online</title>
        <meta name="description" content="Shop authentic handloom, Kanjivaram, Banarasi, and designer sarees from India's finest weavers. Free shipping on orders above ₹999." />
      </Helmet>

      {/* ─── Hero Slider ─── */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          // FIX: Mobile pe height kam, tablet pe medium, desktop pe full
          className="h-[320px] sm:h-[440px] lg:h-[680px]"
        >
          {displayBanners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={banner.image?.url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="page-container w-full">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      // FIX: Mobile pe max-width zyada tight, padding adjust
                      className="max-w-xs sm:max-w-sm md:max-w-xl px-1"
                    >
                      {/* FIX: subtitle mobile pe chota */}
                      <p className="font-accent text-saree-gold text-sm sm:text-base lg:text-lg italic mb-1">{banner.subtitle}</p>
                      {/* FIX: Hero heading mobile pe 2xl, tablet 3xl, desktop 6xl */}
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-2 sm:mb-4">
                        {banner.title}
                      </h1>
                      {/* FIX: description mobile pe hide karo ya chota karo */}
                      <p className="text-white/80 text-xs sm:text-sm lg:text-base mb-4 sm:mb-8 leading-relaxed max-w-xs sm:max-w-md hidden sm:block">
                        {banner.description}
                      </p>
                      {/* FIX: Buttons mobile pe chote */}
                      <div className="flex gap-2 sm:gap-3 flex-wrap">
                        <Link to={banner.link || '/collections'} className="btn-primary text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5">
                          {banner.buttonText || 'Shop Now'} <ArrowRight size={14} />
                        </Link>
                        <Link to="/collections" className="btn-secondary border-white/70 text-white hover:bg-white hover:text-saree-rose text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5">
                          View All
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ─── Features Bar ─── */}
      <section className="bg-white border-y border-gray-100">
        {/* FIX: Mobile pe 2x2 grid, desktop pe 4 col — padding adjust */}
        <div className="page-container py-4 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-center gap-2 sm:gap-3">
                {/* FIX: Icon size mobile pe thoda chota */}
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={color} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-saree-charcoal text-xs sm:text-sm leading-tight">{title}</p>
                  {/* FIX: desc mobile pe hide — nahi to truncate */}
                  <p className="text-gray-400 text-xs hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Shop by their print Grid ─── */}
      {/* FIX: Section padding mobile pe kam */}
      <section className="py-10 sm:py-14">
        <div className="text-center mb-6 sm:mb-10 px-4">
          <p className="font-accent text-saree-rose italic text-sm sm:text-lg mb-1">Explore by Printing Techniques</p>
          <h2 className="section-heading text-xl sm:text-3xl">Shop by their print</h2>
        </div>

        {printCategories.length === 0 ? (
          <div className="flex gap-3 sm:gap-4 py-5 px-5 overflow-hidden">
            {Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="w-28 sm:w-44 flex-shrink-0 rounded-2xl overflow-hidden skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="page-container relative group px-4 sm:px-6 lg:px-8">
            {/* Left Button - desktop only */}
            <button
              onClick={() => scroll(printScrollRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-100 flex items-center justify-center text-saree-rose opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Scroll Container */}
            <div
              ref={printScrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto py-4 sm:py-5 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory mask-gradient-x no-scrollbar"
            >
              {printCategories.map((cat) => {
                const meta = getCategoryMeta(cat);
                return (
                  // FIX: Mobile pe card width 28, sm pe 36, md pe 44
                  <div key={cat._id} className="w-28 sm:w-36 md:w-44 flex-shrink-0 snap-start">
                    <Link
                      to={`/collections/${cat.slug}`}
                      className="group/item flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-2xl hover:bg-saree-blush transition-all duration-300"
                    >
                      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-card group-hover/item:shadow-card-hover transition-shadow">
                        <img
                          src={meta.image}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        <span className="absolute bottom-2 left-0 right-0 text-center text-lg sm:text-2xl">{meta.emoji}</span>
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-saree-charcoal group-hover/item:text-saree-rose transition-colors text-center truncate w-full">
                        {cat.name}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right Button */}
            <button
              onClick={() => scroll(printScrollRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-100 flex items-center justify-center text-saree-rose opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* ─── Banner Strip (Single) ─── */}
      {/* FIX: Padding mobile pe kam, height responsive */}
      <section className="px-4 sm:px-10 py-6 sm:py-10">
        <div>
          {[
            { title: 'New Arrivals', sub: 'Fresh styles just added', cta: 'See What\'s New', href: '/collections?filter=new', image: 'https://github.com/tanveersaurce/sareeImg/blob/main/banner.png?raw=true' },
          ].map((banner) => (
            <Link key={banner.title} to={banner.href} className="group relative rounded-3xl overflow-hidden h-40 sm:h-56 block">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-70`} />
              <div className="absolute inset-0 flex flex-col justify-center pl-5 sm:pl-8">
                {/* FIX: Sub text mobile pe chota */}
                <p className="font-accent text-white/70 italic text-xs sm:text-base mb-1">{banner.sub}</p>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">{banner.title}</h3>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-saree-rose font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit group-hover:shadow-lg transition-shadow">
                  {banner.cta} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Shop by Fabric Grid ─── */}
      <section className="py-10 sm:py-14">
        <div className="text-center mb-6 sm:mb-10 px-4">
          <p className="font-accent text-saree-rose italic text-sm sm:text-lg mb-1">Explore by Fabric Type</p>
          <h2 className="section-heading text-xl sm:text-3xl">Shop by Fabric</h2>
        </div>

        {fabricCategories.length === 0 ? (
          <div className="flex gap-3 sm:gap-4 py-5 px-5 overflow-hidden">
            {Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="w-28 sm:w-44 flex-shrink-0 rounded-2xl overflow-hidden skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="page-container relative group px-4 sm:px-6 lg:px-8">
            {/* Left Button */}
            <button
              onClick={() => scroll(fabricScrollRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-100 flex items-center justify-center text-saree-rose opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Scroll Container */}
            <div
              ref={fabricScrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto py-4 sm:py-5 px-1 sm:px-2 scroll-smooth snap-x snap-mandatory mask-gradient-x no-scrollbar"
            >
              {fabricCategories.map((cat) => {
                const meta = getCategoryMeta(cat);
                return (
                  <div key={cat._id} className="w-28 sm:w-36 md:w-44 flex-shrink-0 snap-start">
                    <Link
                      to={`/collections?fabric=${encodeURIComponent(cat.name)}`}
                      className="group/item flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-2xl hover:bg-saree-blush transition-all duration-300"
                    >
                      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-card group-hover/item:shadow-card-hover transition-shadow">
                        <img
                          src={meta.image}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        <span className="absolute bottom-2 left-0 right-0 text-center text-lg sm:text-2xl">{meta.emoji}</span>
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-saree-charcoal group-hover/item:text-saree-rose transition-colors text-center truncate w-full">
                        {cat.name}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right Button */}
            <button
              onClick={() => scroll(fabricScrollRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white border border-gray-100 flex items-center justify-center text-saree-rose opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* ─── Product Tabs ─── */}
      <section className="bg-gradient-saree py-10 sm:py-14">
        <div className="page-container">
          <div className="text-center mb-6 sm:mb-8 px-4">
            <p className="font-accent text-saree-rose italic text-sm sm:text-lg mb-1">Handpicked for You</p>
            <h2 className="section-heading text-xl sm:text-3xl">Our Collection</h2>
          </div>

          {/* FIX: Tabs — horizontal scroll on mobile, no wrapping */}
          <div className="flex justify-start sm:justify-center mb-6 sm:mb-8 overflow-x-auto pb-1 no-scrollbar px-4 sm:px-0">
            <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm flex-shrink-0">
              {[
                { key: 'featured', label: '⭐ Featured' },
                { key: 'trending', label: '🔥 Trending' },
                { key: 'new', label: '✨ New Arrivals' },
                { key: 'bestseller', label: '👑 Best Sellers' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  // FIX: Mobile pe text aur padding chota
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-saree-rose to-saree-crimson text-white shadow-sm'
                      : 'text-gray-500 hover:text-saree-rose'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-0">
              {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : tabProducts[activeTab].length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-0">
              {tabProducts[activeTab].slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">No products in this collection yet.</p>
          )}

          <div className="text-center mt-8 sm:mt-10">
            <Link to="/collections" className="btn-secondary inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base">
              Explore All Collections <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Banner Strip (Double) ─── */}
      <section className="page-container py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        {/* FIX: Mobile pe single col, sm pe 2 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { title: 'Bridal Special', sub: 'Curated for your big day', cta: 'Shop Bridal', href: '/collections/bridal-sarees', bg: 'from-rose-900 to-pink-700', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=280&fit=crop' },
            { title: 'New Arrivals', sub: 'Fresh styles just added', cta: 'See What\'s New', href: '/collections?filter=new', bg: 'from-purple-900 to-indigo-700', image: 'https://imgs.search.brave.com/caMW2hrlcpPMZ3P8N5SoTt5DpgEpOURh3ny3u4QHIDQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzM0L2Ji/L2I5LzM0YmJiOTJi/OGYyYWNlNDZmMTM3/ZTFkNzM0MDZkZjg5/LmpwZw' },
          ].map((banner) => (
            <Link key={banner.title} to={banner.href} className="group relative rounded-3xl overflow-hidden h-44 sm:h-56 block">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-70`} />
              <div className="absolute inset-0 flex flex-col justify-center pl-5 sm:pl-8">
                <p className="font-accent text-white/70 italic text-xs sm:text-base mb-1">{banner.sub}</p>
                <h3 className="font-display text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">{banner.title}</h3>
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-saree-rose font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit group-hover:shadow-lg transition-shadow">
                  {banner.cta} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-saree-charcoal py-10 sm:py-14">
        <div className="page-container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <p className="font-accent text-saree-gold italic text-sm sm:text-lg mb-1">Stories from our Community</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">What Our Customers Say</h2>
          </div>

          {/* FIX: Mobile pe single col, tablet 2 col, desktop 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
              >
                <div className="flex mb-2 sm:mb-3">
                  {Array(t.rating).fill(0).map((_, s) => (
                    <Star key={s} size={13} className="text-saree-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white text-xs sm:text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saree-blush via-pink-50 to-purple-50 py-12 sm:py-16">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-saree-rose/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="page-container relative text-center px-4 sm:px-6">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-saree-gold mx-auto mb-3 sm:mb-4 animate-float" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-saree-charcoal mb-2 sm:mb-3">
            Find Your Perfect Saree
          </h2>
          <p className="text-gray-500 mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto text-sm sm:text-base">
            Browse over 500+ handpicked sarees from India's finest weavers. Every piece is a work of art.
          </p>
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
            <Link to="/collections" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base gap-2">
              Shop Now <ArrowRight size={15} />
            </Link>
            <Link to="/collections/bridal-sarees" className="btn-secondary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base">
              Bridal Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}