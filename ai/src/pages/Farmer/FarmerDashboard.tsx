import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  TrendingUp,
  CloudSun,
  Bot,
  Sprout,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';
import farmerBgImage from '../../assets/farmer-leaves-bg.png';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const farmerName = user?.name || 'Farmer';

  const primaryActions = [
    {
      title: t.scanCrop,
      desc: t.scanCropDesc,
      icon: (
        <Camera className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/crop-scan',
      tag: 'AI Diagnostic',
      color: 'from-[#E8F5E9] to-white',
      border: 'border-[#4CAF50]'
    },
    {
      title: t.marketRates,
      desc: t.marketRatesDesc,
      icon: (
        <TrendingUp className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/market-rates',
      tag: 'Daily Mandi & Fuel',
      color: 'from-[#F8FAF7] to-white',
      border: 'border-[#DDE8DD]'
    },
    {
      title: t.weather,
      desc: t.weatherDesc,
      icon: (
        <CloudSun className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/weather',
      tag: 'Live Forecast & Spray',
      color: 'from-[#E8F5E9]/50 to-white',
      border: 'border-[#DDE8DD]'
    },
    {
      title: t.aiHelp,
      desc: t.aiHelpDesc,
      icon: (
        <Bot className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/ai-assistant',
      tag: 'Voice-First AI',
      color: 'from-[#E8F5E9] to-white',
      border: 'border-[#4CAF50]'
    },
    {
      title: t.myFarm,
      desc: t.myFarmDesc,
      icon: (
        <Sprout className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/my-farm',
      tag: 'Land & Crops',
      color: 'from-[#F8FAF7] to-white',
      border: 'border-[#DDE8DD]'
    },

    /* =======================================================
       NEW FARM FINANCE CALCULATOR
       ======================================================= */
    {
      title: t.financeCalculatorTitle,
      desc: t.financeCalculatorSubtitle,
      icon: (
        <Calculator className="w-8 h-8 text-[#2E7D32]" />
      ),
      path: '/farmer/finance',
      tag: 'Farm Finance',
      color: 'from-[#E8F5E9] to-white',
      border: 'border-[#4CAF50]'
    }
  ];

  return (
    <div className="farmer-dashboard-bg max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* Full-screen background image with opacity control */}
<div
  className="fixed inset-0 pointer-events-none"
  style={{
    backgroundImage: `url(${farmerBgImage})`,
    backgroundSize: '100% 100%',   // 👈 changed from 'contain' — stretches to fill edge-to-edge
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.45,                  // 👈 dialed back down now that it's confirmed working
    zIndex: -1,
  }}
/>

      {/* Outer floating panel — one shadow + rounded-corner sheet sitting behind the banner and all cards */}
      <div className="relative glass-card rounded-[2rem] shadow-2xl p-6 sm:p-10 space-y-8">

      

      {/* Welcome Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              🌾 {t.roles.farmer}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome},{' '}
            <span className="text-[#2E7D32]">
              {farmerName}
            </span>
          </h1>

        </div>
      </div>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {primaryActions.map(
          (action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className={`glass-card glass-card-hover rounded-3xl p-6 border-2 ${action.border} bg-gradient-to-br ${action.color} flex flex-col justify-between gap-6 group`}
            >

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#DDE8DD] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {action.icon}
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                    {action.tag}
                  </span>

                </div>

                <div className="space-y-1.5">

                  <h3 className="text-xl font-bold text-[#1F2933] group-hover:text-[#2E7D32] transition-colors">
                    {action.title}
                  </h3>

                  <p className="text-sm text-[#5F6B63] leading-relaxed">
                    {action.desc}
                  </p>

                </div>

              </div>

              <div className="pt-3 border-t border-[#DDE8DD]/60 flex items-center justify-between text-sm font-bold text-[#2E7D32]">

                <span>
                  {t.viewAll}
                </span>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              </div>

            </Link>
          )
        )}

      </div>

      {/* Hourly Wage Context Banner */}
      <div className="bg-[#E8F5E9]/60 rounded-2xl p-4 border border-[#DDE8DD] flex items-center justify-between text-xs sm:text-sm text-[#2E7D32] font-semibold">

        <span>
          💡 {t.farmerHourlyRate}
        </span>

        <Link
          to="/farmer/market-rates"
          className="underline hover:text-[#1b4d1f]"
        >
          {t.marketRates} →
        </Link>

      </div>

      </div>

    </div>
  );
};