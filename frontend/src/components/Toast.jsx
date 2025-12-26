import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-[200] animate-in slide-in-from-right duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity`}>
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm ${
                type === 'success' 
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50/90 border-red-200 text-red-800'
            }`}>
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-bold">{message}</span>
                <button 
                    onClick={handleClose}
                    className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Toast Manager Hook
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};

export default Toast;