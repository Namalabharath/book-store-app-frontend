import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken, getCurrentUser } from "../utils/auth";
import getBaseUrl from "../utils/baseURL";
import { useDispatch } from "react-redux";
import { loadUserCart, clearCartOnLogout, syncCartWithStorage } from "../redux/features/cart/cartSlice";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Register a user
    const registerUser = async (userData) => {
        try {
            const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setCurrentUser(data.user);
                // Load user's cart after successful registration
                dispatch(loadUserCart(data.user.id));
                return data;
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Login the user
    const loginUser = async (email, password) => {
        try {
            const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setCurrentUser(data.user);
                // Load user's cart after successful login
                dispatch(loadUserCart(data.user.id));
                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Logout the user
    const logout = () => {
        // Clear cart on logout
        dispatch(clearCartOnLogout());
        removeToken();
        setCurrentUser(null);
    };

    // Check if user is admin
    const isAdmin = () => {
        return currentUser?.role === 'admin';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return currentUser !== null;
    };

    // Initialize auth state
    useEffect(() => {
        console.log('AuthProvider: Initializing auth state...');
        const user = getCurrentUser();
        console.log('AuthProvider: Current user from token:', user);
        setCurrentUser(user);
        // Load user's cart if logged in
        if (user) {
            dispatch(loadUserCart(user.id));
        }
        setLoading(false);
        console.log('AuthProvider: Auth state initialized');
    }, [dispatch]);

    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        logout,
        isAdmin,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};