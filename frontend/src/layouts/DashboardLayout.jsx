import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
    LayoutDashboard,
    Megaphone,
    Bot,
    BarChart3,
    Briefcase,
    Zap,
    Sparkles,
    Settings,
    Bell,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

const NavItem = ({ to, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            cn(
                "px-3 xl:px-4 py-2.5 text-xs xl:text-sm font-semibold transition-all duration-300 relative rounded-lg border uppercase tracking-wide whitespace-nowrap",
                isActive
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700/50 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700/50"
            )
        }
    >
        {label}
    </NavLink>
);

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { notifications, clearNotifications, isMonitoring, showNotificationPopup, setShowNotificationPopup, forceRankingChange, toastNotification } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);
    const [theme, setTheme] = useState(() => {
        // Force light theme as default and clear any existing dark theme
        localStorage.setItem('theme', 'light');
        return 'light';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={`min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300`}>
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700/50 overflow-hidden">
                <div className="flex h-20 items-center px-4 lg:px-6 gap-3 lg:gap-4 max-w-[1600px] mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-black text-lg text-gray-900 dark:text-gray-100 tracking-tighter uppercase hidden lg:block">Campaign.AI</span>
                    </div>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavItem to="/" label="Dashboard" />
                        <NavItem to="/campaigns" label="Campaigns" />
                        <NavItem to="/ai-assistant" label="AI Assistant" />
                        <NavItem to="/ai-marketing" label="AI Marketing" />
                        <NavItem to="/analytics" label="Analytics" />
                        <NavItem to="/workfront" label="Adobe WorkFront" />
                    </nav>

                    <div className="ml-auto flex items-center gap-2 xl:gap-6">
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50"
                                >
                                    <Bell className="w-5 h-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            
                            {/* Notification Popup Portal */}
                            {(showNotifications || showNotificationPopup) && createPortal(
                                <div className="fixed inset-0 z-[99999]" onClick={() => { setShowNotifications(false); setShowNotificationPopup(false); }}>
                                    <div 
                                        className="absolute top-20 right-6 w-80 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-xl backdrop-blur-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Platform Alerts</h3>
                                            <div className="flex items-center gap-2">
                                                {isMonitoring && (
                                                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span>Live</span>
                                                    </div>
                                                )}
                                                {notifications.length > 0 && (
                                                    <button onClick={clearNotifications} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                                        Clear all
                                                    </button>
                                                )}
                                                <button onClick={forceRankingChange} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                                                    Force Change
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                                    {isMonitoring ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span>Monitoring platform performance...</span>
                                                        </div>
                                                    ) : (
                                                        "No new notifications"
                                                    )}
                                                </div>
                                            ) : (
                                                notifications.map(notification => {
                                                    const getNotificationStyle = (type) => {
                                                        switch (type) {
                                                            case 'new-leader':
                                                                return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
                                                            case 'platform-rise':
                                                                return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20';
                                                            case 'performance-surge':
                                                                return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
                                                            default:
                                                                return 'border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
                                                        }
                                                    };
                                                    
                                                    return (
                                                        <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700/60 last:border-b-0 ${getNotificationStyle(notification.type)}`}>
                                                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium leading-relaxed">{notification.message}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                                <span>{notification.timestamp}</span>
                                                                {notification.type === 'new-leader' && <span className="text-yellow-600">👑</span>}
                                                                {notification.type === 'platform-rise' && <span className="text-green-600">🚀</span>}
                                                                {notification.type === 'performance-surge' && <span className="text-blue-600">📈</span>}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>,
                                document.body
                            )}
                            
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50"
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </button>
                            
                            <button
                                onClick={handleLogout}
                                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all duration-300 border border-transparent hover:border-rose-200 dark:hover:border-rose-700/50 group"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pl-3 xl:pl-4 border-l border-gray-200 dark:border-gray-700/50">
                            <div className="text-right hidden 2xl:block">
                                <p className="text-sm font-black text-gray-900 dark:text-gray-100 leading-none">{user?.name || 'Commander'}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Authorized Node</p>
                            </div>
                            <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 border-2 border-white cursor-pointer shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center justify-center text-white font-black text-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'C'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full relative min-h-[calc(100vh-80px)]">
                {/* Toast Notification */}
                {toastNotification && createPortal(
                    <div className="fixed top-24 right-6 z-[99999] animate-in slide-in-from-right-full duration-300">
                        <div className={`max-w-sm p-4 rounded-lg shadow-2xl border-l-4 backdrop-blur-sm ${
                            toastNotification.type === 'new-leader' ? 'bg-yellow-50/95 dark:bg-yellow-900/90 border-l-yellow-500 text-yellow-900 dark:text-yellow-100' :
                            toastNotification.type === 'platform-rise' ? 'bg-green-50/95 dark:bg-green-900/90 border-l-green-500 text-green-900 dark:text-green-100' :
                            toastNotification.type === 'performance-surge' ? 'bg-blue-50/95 dark:bg-blue-900/90 border-l-blue-500 text-blue-900 dark:text-blue-100' :
                            'bg-indigo-50/95 dark:bg-indigo-900/90 border-l-indigo-500 text-indigo-900 dark:text-indigo-100'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">
                                    {toastNotification.type === 'new-leader' && '👑'}
                                    {toastNotification.type === 'platform-rise' && '🚀'}
                                    {toastNotification.type === 'performance-surge' && '📈'}
                                    {!['new-leader', 'platform-rise', 'performance-surge'].includes(toastNotification.type) && '🔔'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm leading-tight">{toastNotification.message}</p>
                                    <p className="text-xs opacity-75 mt-1">{toastNotification.timestamp}</p>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
                {/* Visual Atmosphere */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[5%] right-[10%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
