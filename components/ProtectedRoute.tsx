import React from 'react';
// @ts-ignore
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;