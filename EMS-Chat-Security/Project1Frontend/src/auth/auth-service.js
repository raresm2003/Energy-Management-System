import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null); // Add token state

    const login = async (username, password) => {
        const response = await fetch('http://user-demo.localhost/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            setUserId(data.userId);
            setUserRole(data.userRole);
            setToken(data.token); // Store the token
            return { userId: data.userId, userRole: data.userRole, token: data.token };
        } else {
            alert('Login failed. Please check your credentials.');
            return null;
        }
    };

    const logout = async () => {
        setUserRole(null);
        setUserId(null);
        setToken(null); // Clear the token
    };

    const checkSession = async () => {
        const response = await fetch('http://user-demo.localhost/api/auth/session', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            setUserId(data.userId);
            setUserRole(data.userRole);
            setToken(data.token); // Store the token if session is active
        } else {
            setUserRole(null);
            setUserId(null);
            setToken(null); // Clear the token if session is not active
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout, checkSession, userRole, userId, token }}>
            {children}
        </AuthContext.Provider>
    );
};
