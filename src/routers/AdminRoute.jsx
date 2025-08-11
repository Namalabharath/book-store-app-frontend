import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccessDenied from '../components/AccessDenied';

const AdminRoute = ({children}) => {
  const authContext = useAuth();
  
  // Handle case where context is undefined
  if (!authContext) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Authentication context not available. Please refresh the page.</div>
      </div>
    );
  }
  
  const { currentUser, isAdmin, loading } = authContext;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-blue-600">Loading...</div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login"/>
  }
  
  if (!isAdmin()) {
    return <AccessDenied />;
  }
  
  return children ? children : <Outlet/>;
}

export default AdminRoute