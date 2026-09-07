
// src/components/layout/Footer.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Same dashboard-only scoping as Navbar — floating rounded + shadow
  // footer only inside the actual role dashboards.
  const dashboardRoutes = [
    '/farmer/dashboard',
    '/student-research/dashboard',
    '/company/dashboard',
    '/landowner',
    '/transport/dashboard'
  ];
  const isDashboardPage = dashboardRoutes.includes(location.pathname);

  const footerClasses = isDashboardPage
    ? 'relative z-30 mx-3 sm:mx-6 mb-3 rounded-2xl glass-footer shadow-lg py-1.5'
    : 'relative z-30 w-full glass-footer py-1.5';

  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-1.5">
        <div className="w-5 h-5 rounded-md bg-[#2E7D32] flex items-center justify-center text-white">
          <Sprout className="w-3 h-3" />
        </div>
        <span className="text-[11px] text-[#5F6B63]">| {t.tagline}</span>
      </div>
    </footer>
  );
};