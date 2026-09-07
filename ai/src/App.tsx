import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Welcome } from './pages/Welcome';
import { Splash } from './pages/Splash';
import { RoleSelection } from './pages/RoleSelection';
import { SignUp } from './pages/Auth/SignUp';
import { SignIn } from './pages/Auth/SignIn';

// Farmer
import { FarmerDashboard } from './pages/Farmer/FarmerDashboard';
import { CropScan } from './pages/Farmer/CropScan';
import { MarketRates } from './pages/Farmer/MarketRates';
import { WeatherPage } from './pages/Farmer/WeatherPage';
import { AiAssistant } from './pages/Farmer/AiAssistant';
import { MyFarm } from './pages/Farmer/MyFarm';
import { FarmerJobs } from './pages/Farmer/FarmerJobs';

// Student / Researcher
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { StudentRepository } from './pages/Student/StudentRepository';
import { CompanyDirectory } from './pages/Student/CompanyDirectory';
import { Opportunities } from './pages/Student/Opportunities';

// Company
import { CompanyDashboard } from './pages/Company/CompanyDashboard';
import { CompanyProfilePage } from './pages/Company/CompanyProfile';
import { CompanyInbox } from './pages/Company/CompanyInbox';

// Landowner
import { LandownerHub } from './pages/Landowner/LandownerHub';

// Transport
import { TransportDashboard } from './pages/Transport/TransportDashboard';

// Finance & Community & Profile
import { FinanceDirectory } from './pages/Finance/FinanceDirectory';
import { CommunityChat } from './pages/Community/CommunityChat';
import { ProfileSettings } from './pages/Profile/ProfileSettings';
import { NotFound } from './pages/NotFound';

const RootRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Splash />;

  const routes: Record<string, string> = {
    farmer: '/farmer/dashboard',
    student_researcher: '/student-research/dashboard',
    company: '/company/dashboard',
    landowner: '/landowner',
    transport: '/transport/dashboard'
  };

  return <Navigate to={routes[user.role] || '/farmer/dashboard'} replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="h-screen grid grid-rows-[auto_1fr_auto] bg-[#F8FAF7] text-[#1F2933]">
            <Navbar />
            <main className="min-h-0 overflow-y-auto overflow-x-hidden">
              <Routes>
                {/* Onboarding & Public Auth */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />

                {/* Farmer Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
  path="/farmer/jobs"
  element={
    <ProtectedRoute allowedRoles={['farmer']}>
      <FarmerJobs />
    </ProtectedRoute>
  }
/>
                {/* Farmer Finance Calculator */}
                <Route
  path="/farmer/finance"
  element={
    <ProtectedRoute allowedRoles={['farmer']}>
      <FinanceDirectory />
    </ProtectedRoute>
  }
/>  
                <Route
                  path="/farmer/crop-scan"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <CropScan />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/market-rates"
                  element={
                    <ProtectedRoute allowedRoles={['farmer', 'landowner', 'transport']}>
                      <MarketRates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/weather"
                  element={
                    <ProtectedRoute allowedRoles={['farmer', 'landowner']}>
                      <WeatherPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/ai-assistant"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <AiAssistant />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/my-farm"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <MyFarm />
                    </ProtectedRoute>
                  }
                />

                {/* Student / Researcher Combined Role Routes */}
                <Route
                  path="/student-research/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student_researcher']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-research/repository"
                  element={
                    <ProtectedRoute allowedRoles={['student_researcher', 'company']}>
                      <StudentRepository />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-research/companies"
                  element={
                    <ProtectedRoute allowedRoles={['student_researcher']}>
                      <CompanyDirectory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-research/opportunities"
                  element={
                    <ProtectedRoute allowedRoles={['student_researcher']}>
                      <Opportunities />
                    </ProtectedRoute>
                  }
                />

                {/* Company Routes */}
                <Route
                  path="/company/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <CompanyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/profile"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <CompanyProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/students"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <StudentRepository />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/company/inbox"
                  element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <CompanyInbox />
                    </ProtectedRoute>
                  }
                />

                {/* Landowner Routes */}
                <Route
                  path="/landowner"
                  element={
                    <ProtectedRoute allowedRoles={['landowner']}>
                      <LandownerHub />
                    </ProtectedRoute>
                  }
                />

                {/* Transport Routes */}
                <Route
                  path="/transport/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['transport']}>
                      <TransportDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Role-Based Community Group Chat */}
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <CommunityChat />
                    </ProtectedRoute>
                  }
                />

                {/* Profile Settings */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
};