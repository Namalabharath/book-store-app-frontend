import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const authContext = useAuth();
    
    // Handle case where context is undefined
    if (!authContext) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-600">Authentication context not available. Please refresh the page.</div>
            </div>
        );
    }
    
    const {currentUser, loading} = authContext;

    if(loading) {
        return <div>Loading..</div>
    }
    if(currentUser) {
        return children;
    }
  
    return <Navigate to="/login" replace/>
}

export default PrivateRoute