import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-saree flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-gradient-brand mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-saree-charcoal mb-2">
          Page not found
        </h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary px-8 py-3.5 text-base">
          Go Home
        </Link>
      </div>
    </div>
  );
}
