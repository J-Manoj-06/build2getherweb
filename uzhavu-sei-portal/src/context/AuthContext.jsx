import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (phone) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.phone === phone);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return { success: true, role: foundUser.role };
        }
        return { success: false, message: 'User not found' };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.phone === userData.phone)) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, role: newUser.role };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateUserProfile = (profileData) => {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Also update in the main users list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const newUsers = users.map(u => u.id === user.id ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(newUsers));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
