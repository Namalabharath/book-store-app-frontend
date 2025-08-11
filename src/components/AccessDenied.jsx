import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccessDenied = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          
          {currentUser ? (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current User:</span> {currentUser.username}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Role:</span> {currentUser.role}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Only admin users can access the dashboard.
              </p>
            </div>
          ) : (
            <div className="bg-blue-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                Please log in to access this page.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go to Home
          </Link>
          
          {!currentUser && (
            <Link 
              to="/login" 
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
