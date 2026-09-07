import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#1F2933]">Page Not Found</h1>
      <p className="text-sm text-[#5F6B63] max-w-md">
        The agricultural page or tool you requested does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
};
