import React, { useState } from 'react';
import { Layout, Image as ImageIcon, FileText, Share, Search, FolderPlus, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const Workfront = () => {
    const [activeTab, setActiveTab] = useState('workfront');
    const [currentSlide, setCurrentSlide] = useState(1);

    const tabs = [
        { id: 'workfront', label: 'Adobe WorkFront' },
        { id: 'genstudio', label: 'Adobe GenStudio' },
        { id: 'experience', label: 'Adobe Experience Platform' },
        { id: 'firefly', label: 'Adobe FireFly' }
    ];

    return (
        <div className="min-h-screen bg-gray-100/30 dark:bg-gray-800/30 -mx-8 -mt-8 p-12 space-y-12 animate-in fade-in duration-700">
            {/* Centered Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-primary tracking-tight">Adobe WorkFront</h1>
                <p className="text-muted font-medium text-lg">Explore Adobe WorkFront workflows and creative tools integration</p>
            </div>

            {/* Adobe Style Tab Bar */}
            <div className="max-w-6xl mx-auto flex bg-card backdrop-blur-sm p-1.5 rounded-2xl border border-default shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-sm font-bold transition-all duration-300 rounded-xl ${activeTab === tab.id
                            ? 'bg-card text-indigo-600 shadow-lg shadow-gray-200/50 dark:shadow-black/20 scale-[1.02] border border-light'
                            : 'text-muted hover:text-secondary'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Gallery Card */}
            <div className="max-w-7xl mx-auto glass-card bg-card p-2 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 dark:shadow-black/20 transition-all hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20 border-0">
                <div className="bg-card rounded-[2rem] overflow-hidden border border-light relative group">
                    {/* Top Controls Overlay */}
                    <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-white/90 backdrop-blur shadow-xl rounded-2xl hover:scale-110 transition-transform">
                            <Maximize2 className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                        {/* Featured Image Area */}
                        <div className="bg-[#BFA78D] flex items-center justify-center p-12 relative overflow-hidden group/img">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                            {/* Mock Adobe Identity */}
                            <div className="relative z-10 text-center text-white space-y-6">
                                <div className="text-7xl font-black italic tracking-tighter flex items-center justify-center gap-3">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                                        <span className="text-red-600 text-5xl not-italic">A</span>
                                    </div>
                                    <span className="drop-shadow-lg uppercase tracking-tight">Adobe</span>
                                </div>
                                <p className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs">Sign in or create an account</p>
                            </div>
                        </div>

                        {/* Interaction Area (Sign In Mockup) */}
                        <div className="bg-card p-20 flex flex-col justify-center max-w-xl mx-auto w-full">
                            <h2 className="text-4xl font-black text-primary mb-2">Sign in</h2>
                            <p className="text-muted text-xs font-bold mb-10 uppercase tracking-widest">Email address</p>

                            <div className="space-y-6">
                                <input
                                    type="text"
                                    className="w-full border-b-2 border-gray-200 dark:border-gray-700 bg-transparent py-3 text-lg font-medium text-primary focus:outline-none focus:border-indigo-600 transition-colors"
                                />
                                <div className="flex justify-end">
                                    <button className="bg-indigo-600 text-white px-10 py-3.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200/50 hover:bg-indigo-700 transition-all">
                                        Continue
                                    </button>
                                </div>

                                <div className="relative py-8">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-light"></div></div>
                                    <div className="relative flex justify-center text-xs font-black uppercase tracking-widest text-muted"><span className="bg-card px-4">Or</span></div>
                                </div>

                                <div className="space-y-4">
                                    {['Continue with Google', 'Continue with Facebook', 'Continue with Apple'].map((method) => (
                                        <button key={method} className="w-full py-4 border-2 border-light hover:border-gray-200 dark:hover:border-gray-600 rounded-full flex items-center justify-center gap-4 text-sm font-bold text-secondary transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-sm"></div>
                                            {method}
                                        </button>
                                    ))}
                                </div>

                                <button className="w-full text-center text-xs font-black text-indigo-600 uppercase tracking-widest mt-8 hover:underline">View more</button>
                                <button className="w-full text-center text-[10px] font-black text-muted uppercase tracking-widest mt-4 hover:text-secondary">Get help signing in</button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons (Floating) */}
                    <div className="absolute left-8 bottom-1/2 translate-y-1/2 flex items-center">
                        <button className="p-4 bg-white/90 backdrop-blur shadow-2xl rounded-3xl hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-x-2">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute right-8 bottom-1/2 translate-y-1/2 flex items-center">
                        <button className="p-4 bg-white/90 backdrop-blur shadow-2xl rounded-3xl hover:bg-indigo-600 hover:text-white transition-all transform hover:translate-x-2">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Slide Counter Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-card backdrop-blur rounded-full text-xs font-black text-muted uppercase tracking-widest border border-light shadow-sm">
                        {currentSlide} / 20
                    </div>
                </div>
            </div>

            {/* Bottom Controls / Info Bar */}
            <div className="max-w-7xl mx-auto glass-card bg-card p-8 rounded-[2rem] border border-light shadow-xl shadow-gray-200/40 dark:shadow-black/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-primary uppercase">Adobe Sign in</h3>
                        <p className="text-sm text-muted font-bold uppercase tracking-widest">Image {currentSlide} of 20</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-2">
                            <button className="px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all">
                                <ChevronLeft className="w-4 h-4 inline mr-2" /> Previous
                            </button>
                            <div className="flex items-center bg-slate-50 rounded-xl p-1 px-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4">Jump to:</span>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setCurrentSlide(n)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${currentSlide === n ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <span className="text-slate-300 mx-2">...</span>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-slate-400 hover:text-indigo-600">20</button>
                            </div>
                            <button className="px-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                Next <ChevronRight className="w-4 h-4 inline ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Thumbnails Reel */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 pb-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className={`aspect-[4/3] rounded-xl border-4 transition-all cursor-pointer overflow-hidden ${i + 1 === currentSlide ? 'border-indigo-600' : 'border-white hover:border-slate-200 shadow-sm'}`}
                        onClick={() => setCurrentSlide(i + 1)}
                    >
                        <div className={`w-full h-full ${i % 2 === 0 ? 'bg-[#BFA78D]' : 'bg-slate-50'} animate-pulse`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Workfront;
