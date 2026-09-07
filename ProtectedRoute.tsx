import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#5F6B63]">Loading AGRALYTICX AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's authorized role area
    const roleRoutes: Record<UserRole, string> = {
      farmer: '/farmer/dashboard',
      student_researcher: '/student-research/dashboard',
      company: '/company/dashboard',
      landowner: '/landowner',
      transport: '/transport/dashboard'
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};
