import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Tractor, Activity, Menu } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isFarmer = user?.role === 'farmer';
    const isBuyer = user?.role === 'buyer';

    // Navigation Items based on Role
    const navItems = [
        { label: 'Home', icon: Home, path: isFarmer ? '/farmer/dashboard' : '/buyer/dashboard' },
        ...(isFarmer ? [
            { label: 'My Crops', icon: Activity, path: '/farmer/add-crop' },
            { label: 'Cluster', icon: Activity, path: '/farmer/cluster' },
        ] : []),
        { label: 'Profile', icon: User, path: isFarmer ? '/farmer/profile' : '/buyer/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Top Header */}
            <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center z-10">
                <h1 className="text-xl font-bold tracking-wide">UzhavuSei</h1>
                <div className="flex items-center gap-2">
                    {user && (
                        <button onClick={handleLogout} className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30">
                            Logout
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            {user && (
                <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-center py-3 z-10">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={clsx(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                    isActive ? "text-primary" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <Icon size={24} className={clsx(isActive && "fill-current")} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            )}
        </div>
    );
};

export default Layout;
