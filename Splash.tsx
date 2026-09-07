import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sprout } from 'lucide-react';
import fieldImage from '../assets/field-sunsett.jpg';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  return (
        <div
      className="h-full flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${fieldImage})` }}
    >
      {/* Light readability wash so the card stays legible over a bright photo,
          without dulling the photo the way the old 0.35-opacity version did. */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />

      <div className="relative z-[2] splash-pop">
        <div className="glass-card rounded-3xl px-10 py-10 sm:px-14 sm:py-12 shadow-2xl flex flex-col items-center text-center gap-4 max-w-md mx-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2E7D32] flex items-center justify-center shadow-lg splash-leaf-pulse">
            <Sprout className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
            <span className="bg-[#F8FAF7]/90 px-3 py-1 rounded-lg text-[#1F2933] shadow-sm">
              AGRALYTICX
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#1F2933]/70 tracking-[0.25em] uppercase font-semibold">
            Smart Farming. Smarter Future.
          </p>

          <button
            type="button"
            onClick={() => navigate('/welcome')}
            className="mt-2 w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
