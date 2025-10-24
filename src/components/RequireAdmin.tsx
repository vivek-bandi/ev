import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '@/contexts/AuthContext';

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If no user object yet, send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user exists but not admin, redirect to user home
  if (user.role !== 'admin') {
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default RequireAdmin;
