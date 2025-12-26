import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            login({ email, name: email.split('@')[0] });
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden font-sans">
            {/* Professional Atmospheric Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#4f46e50a_0%,_transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#0d94880a_0%,_transparent_50%)]" />

            <div className="relative z-10 w-full max-w-lg p-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-teal-500 mb-8 shadow-2xl shadow-indigo-600/20 transform hover:scale-110 transition-transform duration-500 cursor-pointer border-4 border-white">
                        <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-3">Campaign.AI</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Strategic Command Interface</p>
                </div>

                <div className="glass-card p-12 backdrop-blur-3xl border border-white shadow-2xl shadow-slate-200/60 pb-16">
                    <form onSubmit={handleLogin} className="space-y-10">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Identity Authorization</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight text-base shadow-inner"
                                    placeholder="commander@vision.ai"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Security Sequence</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight text-base shadow-inner"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Initialize Session <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            New Commander? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors">Request Access</Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Global Operational Status: Secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
