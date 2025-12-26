import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        if (email && name && password) {
            signup({ name, email });
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden font-sans">
            {/* Professional Atmospheric Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#4f46e50a_0%,_transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#0d94880a_0%,_transparent_50%)]" />

            <div className="relative z-10 w-full max-w-lg p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 mb-6 shadow-xl shadow-indigo-600/20 border-2 border-white">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Create Account</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Initialize your strategic command</p>
                </div>

                <div className="glass-card p-10 backdrop-blur-3xl border border-white shadow-2xl shadow-slate-200/60 pb-12">
                    <form onSubmit={handleSignup} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight text-sm shadow-inner"
                                    placeholder="Commander Name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight text-sm shadow-inner"
                                    placeholder="commander@vision.ai"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Password Access</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-12 pr-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-indigo-500/30 transition-all font-bold tracking-tight text-sm shadow-inner"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Register Node <ArrowRight className="w-4 h-4" />
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Already have access? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
