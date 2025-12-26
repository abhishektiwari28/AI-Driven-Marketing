import React, { useState, useEffect } from 'react';
import { X, Share2, Target, CreditCard, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CreateCampaignModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        objective: 'Brand Awareness', // Default objective
        targetAudience: '',
        budget: '',
        platforms: [],
        startDate: '',
        endDate: '',
        aiStrategyNotes: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    objective: initialData.objective || 'Brand Awareness',
                    targetAudience: initialData.targetAudience || '',
                    budget: initialData.budget || '',
                    platforms: initialData.platforms || [],
                    startDate: initialData.timeline?.start_date || '',
                    endDate: initialData.timeline?.end_date || '',
                    aiStrategyNotes: initialData.strategy?.strategy || ''
                });
            } else {
                setFormData({ 
                    name: '', 
                    objective: 'Brand Awareness', 
                    targetAudience: '', 
                    budget: '', 
                    platforms: [], 
                    startDate: '', 
                    endDate: '',
                    aiStrategyNotes: ''
                });
            }
        } else {
            // Restore background scrolling
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);

    const togglePlatform = (p) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(p)
                ? prev.platforms.filter(x => x !== p)
                : [...prev.platforms, p]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let response;
            if (initialData) {
                // Edit Logic
                response = await axios.put(`${API_BASE_URL}/campaigns/${initialData.id}`, {
                    name: formData.name,
                    budget: parseFloat(formData.budget),
                    objective: formData.objective,
                    platforms: formData.platforms
                });
            } else {
                // Create Logic
                response = await axios.post(`${API_BASE_URL}/campaigns`, {
                    name: formData.name,
                    budget: parseFloat(formData.budget),
                    objective: formData.objective,
                    platforms: formData.platforms,
                    targetAudience: formData.targetAudience,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    aiStrategyNotes: formData.aiStrategyNotes
                });
            }
            onSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Error saving campaign:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" style={{ overflow: 'hidden' }}>
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit Campaign' : 'Create Campaign'}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Configure your marketing campaign</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campaign Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Name</label>
                            <div className="relative group">
                                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Winter Sale Campaign"
                                    className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Campaign Objective */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Objective</label>
                            <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <select
                                    required
                                    className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                                    value={formData.objective}
                                    onChange={e => setFormData({ ...formData, objective: e.target.value })}
                                >
                                    <option value="Brand Awareness">Brand Awareness</option>
                                    <option value="Lead Generation">Lead Generation</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Engagement">Engagement</option>
                                </select>
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Young professionals 25-35"
                                className="w-full bg-white border border-slate-300 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                value={formData.targetAudience}
                                onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget (₹)</label>
                            <div className="relative group">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    required
                                    type="number"
                                    placeholder="50000"
                                    className="w-full bg-white border border-slate-300 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-white border border-slate-300 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-white border border-slate-300 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Selection</label>
                        <div className="flex flex-wrap gap-2">
                            {['Email', 'Google Ads', 'Facebook', 'Instagram', 'Twitter'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => togglePlatform(p)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.platforms.includes(p)
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Strategy Notes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Strategy Notes</label>
                            <button
                                type="button"
                                onClick={() => {
                                    if (formData.name && formData.objective && formData.targetAudience) {
                                        setFormData({ 
                                            ...formData, 
                                            aiStrategyNotes: `AI-generated strategy for ${formData.name}: Focus on ${formData.objective.toLowerCase()} targeting ${formData.targetAudience}. Recommended approach includes multi-channel engagement and performance optimization.`
                                        });
                                    } else {
                                        alert('Please fill Campaign Name, Objective, and Target Audience first');
                                    }
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                            >
                                Generate AI Strategy
                            </button>
                        </div>
                        <textarea
                            placeholder="Optional strategy notes or AI-generated recommendations..."
                            rows={3}
                            className="w-full bg-white border border-slate-300 rounded-xl py-3.5 px-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                            value={formData.aiStrategyNotes}
                            onChange={e => setFormData({ ...formData, aiStrategyNotes: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
