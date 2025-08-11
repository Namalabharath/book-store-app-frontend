// JWT Token Management Utilities
export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const token = getToken();
    if (!token) return null;
    
    try {
        // Decode JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp * 1000 < Date.now()) {
            removeToken();
            return null;
        }
        
        return {
            id: payload.id,
            username: payload.username,
            email: payload.email,
            role: payload.role
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        removeToken();
        return null;
    }
};

export const isTokenValid = () => {
    const user = getCurrentUser();
    return user !== null;
};