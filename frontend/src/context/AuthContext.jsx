import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. When the app loads, check if there is a saved user in LocalStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));

    // 2. Initialize state with saved user (if they exist) OR default logged-out state
    const [user, setUser] = useState(savedUser || { 
        isAuthenticated: false, 
        role: null,
        email: null,
        id: null
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);