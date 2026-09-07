const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Audio Button Component (Listen to any text in selected language)
const audioBtn = `import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../../services/speech';
import { useLanguage } from '../../i18n/LanguageContext';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  className = '',
  size = 'md',
  label
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language, t } = useLanguage();

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechService.speak(text, language, () => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={\`inline-flex items-center gap-1.5 rounded-full font-medium transition-all \${
        isPlaying
          ? 'bg-[#2E7D32] text-white shadow-md animate-pulse'
          : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#DDE8DD]'
      } \${sizeClasses[size]} \${className}\`}
      title={isPlaying ? 'Stop voice' : t.listen}
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {label || (isPlaying ? 'Playing...' : t.listen)}
    </button>
  );
};
`;
save('src/components/common/AudioButton.tsx', audioBtn);

// 2. Navigation Bar (Clean, Minimal, Non-crowded, Role-specific shortcuts, Language Switcher, Profile Menu)
const navbarCode = `import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Globe, 
  User, 
  LogOut, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Landmark
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, signOut, updateUserLanguage } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const getDashboardRoute = (role?: UserRole): string => {
    switch (role) {
      case 'farmer': return '/farmer/dashboard';
      case 'student_researcher': return '/student-research/dashboard';
      case 'company': return '/company/dashboard';
      case 'landowner': return '/landowner';
      case 'transport': return '/transport/dashboard';
      default: return '/';
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    if (isAuthenticated && user) {
      updateUserLanguage(lang);
    }
    setLangDropdownOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/welcome');
    setProfileDropdownOpen(false);
  };

  const currentDashboardPath = getDashboardRoute(user?.role);

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav bg-white/95 border-b border-[#DDE8DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to={isAuthenticated ? currentDashboardPath : '/'} className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center shadow-sm text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#2E7D32]">
                AGRALYTICX <span className="text-[#4CAF50]">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-[#5F6B63]">
                {t.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                {/* Primary Action 1: Role Dashboard */}
                <Link
                  to={currentDashboardPath}
                  className={\`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors \${
                    location.pathname.includes('dashboard') || location.pathname === '/landowner'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#1F2933] hover:bg-[#F8FAF7]'
                  }\`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboard}
                </Link>

                {/* Primary Action 2: Role-based Community */}
                <Link
                  to="/community"
                  className={\`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors \${
                    location.pathname === '/community'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#1F2933] hover:bg-[#F8FAF7]'
                  }\`}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.community}
                </Link>

                {/* Public Open Finance */}
                <Link
                  to="/finance"
                  className={\`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors \${
                    location.pathname === '/finance'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#5F6B63] hover:text-[#1F2933] hover:bg-[#F8FAF7]'
                  }\`}
                >
                  <Landmark className="w-4 h-4" />
                  {t.financeTitle}
                </Link>

                {/* Role Specific 'More' dropdown to keep Navbar minimal */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreDropdownOpen(!moreDropdownOpen);
                      setLangDropdownOpen(false);
                      setProfileDropdownOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#5F6B63] hover:text-[#1F2933] hover:bg-[#F8FAF7] flex items-center gap-1"
                  >
                    {t.more}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {moreDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#DDE8DD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {user?.role === 'farmer' && (
                        <>
                          <Link
                            to="/farmer/crop-scan"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🌱 {t.scanCrop}
                          </Link>
                          <Link
                            to="/farmer/market-rates"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            💰 {t.marketRates}
                          </Link>
                          <Link
                            to="/farmer/weather"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🌤 {t.weather}
                          </Link>
                          <Link
                            to="/farmer/ai-assistant"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🤖 {t.aiHelp}
                          </Link>
                          <Link
                            to="/farmer/my-farm"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🌾 {t.myFarm}
                          </Link>
                        </>
                      )}

                      {user?.role === 'student_researcher' && (
                        <>
                          <Link
                            to="/student-research/repository"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            📚 {t.studentRepository}
                          </Link>
                          <Link
                            to="/student-research/companies"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🏢 {t.companyDirectory}
                          </Link>
                          <Link
                            to="/student-research/opportunities"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🎯 {t.opportunitiesAndGrants}
                          </Link>
                        </>
                      )}

                      {user?.role === 'company' && (
                        <>
                          <Link
                            to="/company/profile"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🏢 {t.companyProfile}
                          </Link>
                          <Link
                            to="/company/students"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🎓 {t.findStudents}
                          </Link>
                          <Link
                            to="/company/inbox"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            📬 {t.inbox}
                          </Link>
                        </>
                      )}

                      {user?.role === 'transport' && (
                        <>
                          <Link
                            to="/transport/dashboard"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            🗺 {t.routeMap}
                          </Link>
                          <Link
                            to="/transport/dashboard#guide"
                            onClick={() => setMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
                          >
                            📋 {t.transportSiteGuide}
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/finance"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#5F6B63] hover:text-[#1F2933] hover:bg-[#F8FAF7]"
                >
                  {t.financeTitle}
                </Link>
              </>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setProfileDropdownOpen(false);
                  setMoreDropdownOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DDE8DD] flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>
                  {language === 'en' ? 'English' : language === 'ur' ? 'اردو' : 'پنجابی'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-xl border border-[#DDE8DD] py-2 z-50">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={\`w-full text-left px-4 py-2 text-sm \${language === 'en' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}\`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ur')}
                    className={\`w-full text-right px-4 py-2 text-sm font-urdu \${language === 'ur' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}\`}
                  >
                    اردو (Urdu)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('pa')}
                    className={\`w-full text-right px-4 py-2 text-sm font-urdu \${language === 'pa' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}\`}
                  >
                    پنجابی (Punjabi)
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown or Sign In/Sign Up */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setLangDropdownOpen(false);
                    setMoreDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#DDE8DD] hover:border-[#4CAF50] bg-white transition-all shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-[#1F2933] max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5F6B63]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-[#DDE8DD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#DDE8DD]">
                      <p className="text-xs text-[#5F6B63]">{t.welcome}</p>
                      <p className="text-sm font-bold text-[#1F2933] truncate">{user.name}</p>
                      <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-semibold uppercase">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#F8FAF7] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#5F6B63]" />
                      {t.profile}
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-[#DDE8DD]"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/sign-in"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                >
                  {t.signIn}
                </Link>
                <Link
                  to="/role-selection"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#2E7D32] hover:bg-[#1b4d1f] text-white shadow-xs transition-colors"
                >
                  {t.signUp}
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => handleLanguageChange(language === 'en' ? 'ur' : language === 'ur' ? 'pa' : 'en')}
              className="p-2 rounded-lg text-xs font-bold bg-[#E8F5E9] text-[#2E7D32]"
            >
              {language === 'en' ? 'EN' : language === 'ur' ? 'اردو' : 'پنجابی'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1F2933] hover:bg-[#E8F5E9]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE8DD] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {isAuthenticated && user ? (
            <>
              <div className="pb-3 border-b border-[#DDE8DD]">
                <p className="text-xs text-[#5F6B63]">{t.welcome}</p>
                <p className="text-base font-bold text-[#1F2933]">{user.name}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-semibold uppercase">
                  {user.role}
                </span>
              </div>

              <Link
                to={currentDashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
              >
                {t.dashboard}
              </Link>

              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
              >
                {t.community}
              </Link>

              <Link
                to="/finance"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
              >
                {t.financeTitle}
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
              >
                {t.profile}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                {t.logout}
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl border border-[#2E7D32] text-[#2E7D32] font-bold"
              >
                {t.signIn}
              </Link>
              <Link
                to="/role-selection"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold"
              >
                {t.signUp}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
`;
save('src/components/layout/Navbar.tsx', navbarCode);

// 3. Footer Component
const footerCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-[#DDE8DD] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[#2E7D32] text-lg">AGRALYTICX AI</span>
            <span className="text-xs text-[#5F6B63] ml-2">| {t.tagline}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#5F6B63]">
            <Link to="/finance" className="hover:text-[#2E7D32] transition-colors">
              {t.financeTitle}
            </Link>
            <Link to="/community" className="hover:text-[#2E7D32] transition-colors">
              {t.community}
            </Link>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5F6B63]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Pakistani Agriculture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
`;
save('src/components/layout/Footer.tsx', footerCode);

// 4. Job Notification Modal (Auto-translated for Farmers when Landowners post a job)
const jobNotifModal = `import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, XCircle, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { db } from '../../services/db';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FarmerJob } from '../../types';
import { AudioButton } from './AudioButton';

export const JobNotificationModal: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeJob, setActiveJob] = useState<FarmerJob | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'farmer') return;

    const checkJobs = () => {
      const allJobs = db.getAllFarmerJobs();
      // Find open job that farmer hasn't responded to yet
      const openJob = allJobs.find(
        (j) => j.status === 'Open' && !j.applicants.some((a) => a.farmerId === user.userId)
      );
      if (openJob && !isDismissed) {
        setActiveJob(openJob);
      }
    };

    checkJobs();
    const unsub = db.subscribe('agralyticx_farmer_jobs', () => {
      checkJobs();
    });
    return unsub;
  }, [user, isDismissed]);

  if (!activeJob || isDismissed || user?.role !== 'farmer') return null;

  const handleRespond = (action: 'accepted' | 'rejected') => {
    db.respondToJob(activeJob.id, user.userId, user.name, action, user.phone || '0300-1234567');
    setActionDone(action === 'accepted' ? t.acceptJob : t.rejectJob);
    setTimeout(() => {
      setIsDismissed(true);
      setActiveJob(null);
    }, 1500);
  };

  const notificationSpeechText = \`New Farm Job: \${activeJob.jobType} for \${activeJob.crop} in \${activeJob.location}. Hourly rate is \${activeJob.hourlyRate} rupees. Tap accept to apply.\`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#4CAF50] space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1F2933]">
                {t.jobNotificationTitle}
              </h3>
              <p className="text-xs text-[#5F6B63]">{activeJob.landownerName}</p>
            </div>
          </div>
          <AudioButton text={notificationSpeechText} size="sm" />
        </div>

        {/* Job Details Card */}
        <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#5F6B63] font-medium">{t.jobType}:</span>
            <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
              {activeJob.jobType} - {activeJob.crop}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#1F2933]">
            <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0" />
            <span>{activeJob.location}, {activeJob.district}</span>
          </div>

          <div className="flex items-center gap-2 text-[#1F2933]">
            <Calendar className="w-4 h-4 text-[#4CAF50] shrink-0" />
            <span>{activeJob.date} ({activeJob.workingHours})</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#DDE8DD]">
            <div className="flex items-center gap-1.5 text-[#1F2933] font-bold">
              <DollarSign className="w-4 h-4 text-[#2E7D32]" />
              <span>Rs. {activeJob.hourlyRate} / hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5F6B63]">
              <Users className="w-3.5 h-3.5" />
              <span>{activeJob.farmersNeeded} {t.numberOfFarmersNeeded}</span>
            </div>
          </div>
        </div>

        {/* Action Status Feedback */}
        {actionDone ? (
          <div className="text-center py-2 font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-xl animate-pulse">
            ✓ {actionDone}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleRespond('rejected')}
              className="py-3 rounded-xl font-bold text-[#5F6B63] bg-[#F8FAF7] hover:bg-[#DDE8DD] transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-5 h-5 text-red-500" />
              {t.rejectJob}
            </button>
            <button
              type="button"
              onClick={() => handleRespond('accepted')}
              className="py-3 rounded-xl font-bold text-white bg-[#2E7D32] hover:bg-[#1b4d1f] shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-5 h-5" />
              {t.acceptJob}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
`;
save('src/components/common/JobNotificationModal.tsx', jobNotifModal);

console.log('Layout & Common components generated successfully');