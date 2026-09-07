import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Inbox, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';
import companyBgImage from '../../assets/company-dashboard-bg.png';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bgOpacity, setBgOpacity] = useState(0.15);

  const primaryActions = [
    {
      title: t.manageCompanyProfile,
      desc: 'Update your corporate agribusiness profile, crop needs, and research requirements.',
      icon: <Building2 className="w-8 h-8 text-[#2E7D32]" />,
      path: '/company/profile',
      tag: 'Corporate Profile'
    },
    {
      title: t.findResearchers,
      desc: 'Discover university researchers, agronomists, and biotechnology projects.',
      icon: <Users className="w-8 h-8 text-[#2E7D32]" />,
      path: '/company/students',
      tag: 'Academic Talent'
    },
  ];

  return (
    <div
  className="company-dashboard-bg max-w-6xl mx-auto px-4 py-8 space-y-8"
  style={{ '--company-bg-opacity': bgOpacity } as React.CSSProperties}
>

      {/* Full-screen background image with opacity control */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${companyBgImage})`,
          backgroundSize: '100% 100%',   // stretches to fill edge-to-edge, same as Farmer dashboard
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.45,
          zIndex: -1,
        }}
      />

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🏢 {t.roles.company}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {primaryActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="glass-card glass-card-hover rounded-3xl p-6 border-2 border-[#DDE8DD] hover:border-[#4CAF50] bg-white flex flex-col justify-between gap-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
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
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};