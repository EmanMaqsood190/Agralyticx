const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Welcome Page
const welcomePage = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../types';
import { AudioButton } from '../components/common/AudioButton';

export const Welcome: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  const handleProceed = () => {
    navigate('/role-selection');
  };

  const languagesList: { code: LanguageCode; label: string; native: string; subtitle: string }[] = [
    {
      code: 'en',
      label: 'English',
      native: 'English',
      subtitle: 'Simple, direct international English'
    },
    {
      code: 'ur',
      label: 'Urdu',
      native: 'اردو',
      subtitle: 'قومی زبان میں آسان اور مکمل رہنمائی'
    },
    {
      code: 'pa',
      label: 'Pakistani Punjabi',
      native: 'پنجابی (شاہ مکھی)',
      subtitle: 'اپنی ماء بولی چ سوکھی کھیتی باڑی دی صلاح'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between">
      
      {/* Top Bar */}
      <header className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#2E7D32]">AGRALYTICX AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AudioButton text={\`Welcome to Agralyticx AI. \${t.tagline} Please choose your language.\`} size="sm" />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center items-center text-center">
        
        {/* Hero Glass Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 w-full border border-[#DDE8DD] shadow-xl space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
              🌾 Pakistan Agricultural Intelligence Platform
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2933] tracking-tight">
              AGRALYTICX <span className="text-[#2E7D32]">AI</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-[#5F6B63]">
              {t.tagline}
            </p>
          </div>

          {/* Language Selection Step */}
          <div className="space-y-4 pt-4 border-t border-[#DDE8DD]/60">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold text-[#1F2933]">
                {t.chooseLanguage}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {languagesList.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={\`p-4 rounded-2xl border-2 text-left sm:text-center transition-all flex flex-col justify-between gap-2 relative \${
                      isSelected
                        ? 'border-[#2E7D32] bg-[#E8F5E9] shadow-md scale-102'
                        : 'border-[#DDE8DD] bg-white hover:border-[#4CAF50] hover:bg-[#F8FAF7]'
                    }\`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-bold text-[#1F2933] font-urdu">
                        {lang.native}
                      </div>
                      <div className="text-xs font-semibold text-[#5F6B63]">
                        {lang.label}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5F6B63] leading-tight">
                      {lang.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </main>

      {/* Footer minimal info */}
      <footer className="p-4 text-center text-xs text-[#5F6B63]">
        AGRALYTICX AI • Built for Farmers, Researchers, Agri-Business, Landowners & Transport
      </footer>

    </div>
  );
};
`;
save('src/pages/Welcome.tsx', welcomePage);

// 2. Role Selection Page
const roleSelectionPage = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  GraduationCap, 
  Building2, 
  Trees, 
  Truck, 
  ArrowRight, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';
import { AudioButton } from '../components/common/AudioButton';

export const RoleSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  const rolesConfig: {
    id: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: 'farmer',
      title: t.roles.farmer,
      description: t.roles.farmerDesc,
      icon: <Sprout className="w-7 h-7 text-[#2E7D32]" />,
      badge: '🌾 Primary Role'
    },
    {
      id: 'student_researcher',
      title: t.roles.studentResearcher,
      description: t.roles.studentResearcherDesc,
      icon: <GraduationCap className="w-7 h-7 text-[#2E7D32]" />,
      badge: '🎓 Academic & Innovation'
    },
    {
      id: 'company',
      title: t.roles.company,
      description: t.roles.companyDesc,
      icon: <Building2 className="w-7 h-7 text-[#2E7D32]" />,
      badge: '🏢 Agribusiness'
    },
    {
      id: 'landowner',
      title: t.roles.landowner,
      description: t.roles.landownerDesc,
      icon: <Trees className="w-7 h-7 text-[#2E7D32]" />,
      badge: '🌳 Farm Management'
    },
    {
      id: 'transport',
      title: t.roles.transport,
      description: t.roles.transportDesc,
      icon: <Truck className="w-7 h-7 text-[#2E7D32]" />,
      badge: '🚚 Agri Freight'
    }
  ];

  const handleContinue = () => {
    localStorage.setItem('agralyticx_onboarding_role', selectedRole);
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between py-6 px-4">
      
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-1 text-sm font-semibold text-[#5F6B63] hover:text-[#1F2933]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <AudioButton text={\`\${t.chooseRole}. Please select your account type.\`} size="sm" />
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center">
        <div className="w-full space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2933]">
              {t.chooseRole}
            </h1>
            <p className="text-sm sm:text-base text-[#5F6B63] max-w-lg mx-auto">
              Select who you are so we can tailor the simplest interface for you.
            </p>
          </div>

          {/* 5 Distinct Roles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rolesConfig.map((item) => {
              const isSelected = selectedRole === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRole(item.id)}
                  className={\`glass-card p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between gap-3 \${
                    isSelected
                      ? 'border-[#2E7D32] bg-[#E8F5E9]/90 shadow-md scale-102'
                      : 'border-[#DDE8DD] bg-white/90 hover:border-[#4CAF50] hover:bg-[#F8FAF7]'
                  }\`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#DDE8DD] text-[#2E7D32]">
                      {item.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#1F2933]">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5F6B63] leading-relaxed">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{t.createAccount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="text-sm font-semibold text-[#2E7D32] hover:underline"
            >
              {t.alreadyHaveAccount} {t.signIn}
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#5F6B63]">
        AGRALYTICX AI • Simplicity & Accessibility
      </footer>

    </div>
  );
};
`;
save('src/pages/RoleSelection.tsx', roleSelectionPage);

// 3. Real Sign Up Page
const signUpPage = `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, User, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';
import { AudioButton } from '../components/common/AudioButton';

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const preselectedRole = (localStorage.getItem('agralyticx_onboarding_role') as UserRole) || 'farmer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(preselectedRole);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    const res = await signUp({
      name,
      email,
      pass: password,
      role,
      language
    });

    setIsSubmitting(false);

    if (res.success && res.user) {
      // Redirect to individual role dashboard
      const roleRoutes: Record<UserRole, string> = {
        farmer: '/farmer/dashboard',
        student_researcher: '/student-research/dashboard',
        company: '/company/dashboard',
        landowner: '/landowner',
        transport: '/transport/dashboard'
      };
      navigate(roleRoutes[res.user.role]);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-[#2E7D32]">AGRALYTICX AI</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#1F2933]">
          {t.createAccount}
        </h2>
        <p className="text-sm text-[#5F6B63]">
          Create your verified account in 30 seconds
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-[#DDE8DD] shadow-xl space-y-6">
          
          <div className="flex justify-end">
            <AudioButton text="Fill out your name, email and password to create your account." size="sm" />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.emailAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@agri.pk"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            {/* Role (Confirm or Switch) */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.chooseRole}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="farmer">🌾 {t.roles.farmer}</option>
                <option value="student_researcher">🎓 {t.roles.studentResearcher}</option>
                <option value="company">🏢 {t.roles.company}</option>
                <option value="landowner">🌳 {t.roles.landowner}</option>
                <option value="transport">🚚 {t.roles.transport}</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <span>{t.creatingAccount}</span>
              ) : (
                <>
                  <span>{t.createAccount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-2 text-center text-xs text-[#5F6B63] border-t border-[#DDE8DD]">
            <span>{t.alreadyHaveAccount} </span>
            <Link to="/sign-in" className="font-bold text-[#2E7D32] hover:underline">
              {t.signIn}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Auth/SignUp.tsx', signUpPage);

// 4. Real Sign In Page
const signInPage = `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';
import { AudioButton } from '../components/common/AudioButton';

export const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      const roleRoutes: Record<UserRole, string> = {
        farmer: '/farmer/dashboard',
        student_researcher: '/student-research/dashboard',
        company: '/company/dashboard',
        landowner: '/landowner',
        transport: '/transport/dashboard'
      };
      navigate(roleRoutes[res.user.role]);
    } else {
      setError(res.error || 'Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-[#2E7D32]">AGRALYTICX AI</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-[#1F2933]">
          {t.signIn}
        </h2>
        <p className="text-sm text-[#5F6B63]">
          Sign in to access your agricultural dashboard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-[#DDE8DD] shadow-xl space-y-6">
          
          <div className="flex justify-end">
            <AudioButton text="Enter your email and password to sign in." size="sm" />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.emailAddress}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agri.pk"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <span>{t.signingIn}</span>
              ) : (
                <>
                  <span>{t.signIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="pt-2 text-center text-xs text-[#5F6B63] border-t border-[#DDE8DD]">
            <span>{t.dontHaveAccount} </span>
            <Link to="/role-selection" className="font-bold text-[#2E7D32] hover:underline">
              {t.signUp}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Auth/SignIn.tsx', signInPage);

console.log('Onboarding & Auth pages generated successfully');