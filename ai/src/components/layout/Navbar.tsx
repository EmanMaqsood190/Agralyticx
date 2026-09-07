import React, { useEffect, useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode, UserRole } from '../../types';
import { db } from '../../services/db';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, signOut, updateUserLanguage } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [newJobCount, setNewJobCount] = useState(0);

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
  useEffect(() => {
  if (!user || user.role !== 'farmer') {
    setNewJobCount(0);
    return;
  }

  const updateJobCount = () => {
    const jobs = db.getJobsForFarmer(user.userId);
    const seenIds = db.getSeenFarmerJobIds(user.userId);

    const count = jobs.filter(
      (job) => !seenIds.includes(job.id)
    ).length;

    setNewJobCount(count);
  };

  updateJobCount();

  const unsubscribeJobs = db.subscribe(
    'agralyticx_farmer_jobs',
    updateJobCount
  );

  const unsubscribeSeen = db.subscribe(
    `agralyticx_farmer_seen_jobs_${user.userId}`,
    updateJobCount
  );

  return () => {
    unsubscribeJobs();
    unsubscribeSeen();
  };
}, [user]);

    // Only the very first "Get Started" splash page (route "/") gets the
  // solid sky-blue nav bar. Welcome and Role Selection keep the normal
  // frosted-glass nav, unchanged.
  const isPublicOnboarding = location.pathname === '/';

  // Floating rounded + shadow nav only inside the actual role dashboards —
  // every other page (splash, welcome, sign-in/up, community, profile, etc.)
  // keeps the plain edge-to-edge nav.
  const dashboardRoutes = [
    '/farmer/dashboard',
    '/student-research/dashboard',
    '/company/dashboard',
    '/landowner',
    '/transport/dashboard'
  ];
  const isDashboardPage = dashboardRoutes.includes(location.pathname);

  const navClasses = isPublicOnboarding
  ? 'sticky top-0 z-[100000] w-full shadow-sm'
  : isDashboardPage
  ? 'sticky top-3 z-[100000] mx-3 sm:mx-6 rounded-2xl glass-nav shadow-lg'
  : 'sticky top-0 z-[100000] w-full glass-nav';

  return (
    <nav
      className={navClasses}
      style={isPublicOnboarding ? { background: 'linear-gradient(180deg, #7EC8F0 0%, #A8DDF5 100%)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo & Brand */}
          <Link to={isAuthenticated ? currentDashboardPath : '/'} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2E7D32] to-[#4CAF50] flex items-center justify-center shadow-sm text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span
                className="text-xl font-extrabold tracking-tight text-[#2E7D32]"
              >
                AGRALYTICX{' '}
                <span className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {isAuthenticated && (
              <>
                {/* Primary Action 1: Role Dashboard */}
                <Link
                  to={currentDashboardPath}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    location.pathname.includes('dashboard') || location.pathname === '/landowner'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#1F2933] hover:bg-[#F8FAF7]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboard}
                </Link>
                {/* Farmer Jobs */}
{user?.role === 'farmer' && (
  <Link
    to="/farmer/jobs"
    className={`relative px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
      location.pathname === '/farmer/jobs'
        ? 'bg-[#E8F5E9] text-[#2E7D32]'
        : 'text-[#1F2933] hover:bg-[#F8FAF7]'
    }`}
  >
    <Briefcase className="w-4 h-4" />
    Jobs

    {newJobCount > 0 && (
      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-extrabold flex items-center justify-center">
        {newJobCount > 99 ? '99+' : newJobCount}
      </span>
    )}
  </Link>
)}

                {/* Primary Action 2: Role-based Community */}
                <Link
                  to="/community"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    location.pathname === '/community'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'text-[#1F2933] hover:bg-[#F8FAF7]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.community}
                </Link>

                {/* Role Specific 'More' dropdown - hidden for Transport */}
                {user?.role !== 'transport' && (
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
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#DDE8DD] py-2 z-[100001] animate-in fade-in slide-in-from-top-2 duration-150">
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
                            <Link
  to="/farmer/finance"
  onClick={() => setMoreDropdownOpen(false)}
  className="block px-4 py-2 text-sm text-[#1F2933] hover:bg-[#E8F5E9]"
>
  🧮 {t.financeCalculatorTitle}
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
                      </div>
                    )}
                  </div>
                )}
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
                    className={`w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('ur')}
                    className={`w-full text-right px-4 py-2 text-sm font-urdu ${language === 'ur' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}`}
                  >
                    اردو
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('pa')}
                    className={`w-full text-right px-4 py-2 text-sm font-urdu ${language === 'pa' ? 'bg-[#E8F5E9] font-bold text-[#2E7D32]' : 'text-[#1F2933] hover:bg-[#F8FAF7]'}`}
                  >
                    پنجابی 
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
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/70" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-bold text-[#1F2933] max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5F6B63]" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-[#DDE8DD] py-2 z-[100001] animate-in fade-in slide-in-from-top-2 duration-150">
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
        <div className="md:hidden border-t border-white/30 glass-mobile-menu px-4 pt-3 pb-6 space-y-3 shadow-lg">
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
              {user?.role === 'farmer' && (
  <Link
    to="/farmer/jobs"
    onClick={() => setMobileMenuOpen(false)}
    className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium ${
      location.pathname === '/farmer/jobs'
        ? 'bg-[#E8F5E9] text-[#2E7D32]'
        : 'text-[#1F2933] hover:bg-[#E8F5E9]'
    }`}
  >
    <span className="flex items-center gap-2">
      <Briefcase className="w-4 h-4" />
      Jobs
    </span>

    {newJobCount > 0 && (
      <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-[#2E7D32] text-white text-xs font-extrabold flex items-center justify-center">
        {newJobCount > 99 ? '99+' : newJobCount}
      </span>
    )}
  </Link>
)}

              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
              >
                {t.community}
              </Link>

              

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5F0]"
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
              {user?.role === 'farmer' && (
  <Link
    to="/farmer/finance"
    onClick={() => setMobileMenuOpen(false)}
    className="block px-3 py-2 rounded-lg text-base font-medium text-[#1F2933] hover:bg-[#E8F5E9]"
  >
    🧮 {t.financeCalculatorTitle}
  </Link>
)}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};