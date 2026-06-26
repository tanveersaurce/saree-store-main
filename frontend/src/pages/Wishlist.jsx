import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { wishlistAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Wishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistAPI.get().then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullPage />;
  const items = data?.wishlist || [];

  return (
    <>
      <Helmet><title>My Wishlist | Saaj</title></Helmet>
      <div className="page-container py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-saree-charcoal mb-8 flex items-center gap-2">
          <Heart size={24} className="text-saree-rose" fill="currentColor" />
          My Wishlist
          {items.length > 0 && <span className="text-saree-rose">({items.length})</span>}
        </h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-display text-xl text-gray-400 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mb-6">Save sarees you love and come back to them anytime</p>
            <Link to="/collections" className="btn-primary">Browse Collections</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
