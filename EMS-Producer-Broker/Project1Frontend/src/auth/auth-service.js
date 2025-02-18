import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

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
            return { userId: data.userId, userRole: data.userRole };
        } else {
            alert('Login failed. Please check your credentials.');
            return null;
        }
    };

    const logout = () => {
        setUserRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ login, logout, userRole, userId, setUserRole, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};
