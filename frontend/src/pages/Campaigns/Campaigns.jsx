import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Pause, MoreVertical, TrendingUp, Plus, X, Share2, Loader2, CheckCircle, Clock, ShieldCheck, PenTool } from 'lucide-react';
import axios from 'axios';
import CreateCampaignModal from '../../components/CreateCampaignModal';
import { useNotifications } from '../../context/NotificationContext';

const API_BASE_URL = '/api';

const CampaignCard = ({ campaign, onAction, onViewDetail, onEdit }) => {
    const getButtonConfig = () => {
        switch (campaign.status) {
            case 'Draft':
                return {
                    text: 'Launch',
                    action: 'Launch',
                    icon: <Play className="w-4 h-4" />,
                    className: 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                };
            case 'Active':
                return {
                    text: 'Pause',
                    action: 'Pause',
                    icon: <Pause className="w-4 h-4" />,
                    className: 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50'
                };
            case 'Paused':
                return {
                    text: 'Resume',
                    action: 'Resume',
                    icon: <Play className="w-4 h-4" />,
                    className: 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700'
                };
            default:
                return {
                    text: 'Launch',
                    action: 'Launch',
                    icon: <Play className="w-4 h-4" />,
                    className: 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700'
                };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <div className="glass-card p-6 flex flex-col h-full group hover:border-indigo-400/50 transition-all duration-300 shadow-sm hover:shadow-lg">
            <div className="flex flex-col gap-4 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border mb-2 inline-block uppercase tracking-widest ${
                            campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            campaign.status === 'Paused' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            campaign.status === 'Draft' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                            {campaign.status}
                        </span>
                        <h3 className="text-xl font-black text-primary group-hover:text-indigo-600 transition-colors uppercase tracking-tight mb-1 leading-tight">{campaign.name}</h3>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest">{campaign.platforms?.join(', ') || 'Omnichannel'} • {campaign.objective || 'Growth'}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => onEdit(campaign)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Configuration">
                            <TrendingUp className="w-4 h-4" />
                        </button>
                        {campaign.broadcast_log && (
                            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg" title="Broadcast Live">
                                <Share2 className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1 py-4 border-y border-light mt-auto">
                <div className="border-r border-light pr-2">
                    <p className="text-[10px] text-muted uppercase font-black tracking-widest mb-1">Forecast</p>
                    <p className="font-black text-secondary tracking-tight">{campaign.roi_forecast?.projected_roi || '0.0'}x</p>
                </div>
                <div className="border-r border-light px-2">
                    <p className="text-[10px] text-muted uppercase font-black tracking-widest mb-1">Conversions</p>
                    <p className="font-black text-emerald-600 tracking-tight">{campaign.roi_forecast?.projected_conversions || 0}</p>
                </div>
                <div className="pl-2">
                    <p className="text-[10px] text-muted uppercase font-black tracking-widest mb-1">Schedule</p>
                    <p className="font-black text-secondary tracking-tight">{campaign.timeline?.duration_days || 30}d</p>
                </div>
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 rounded-xl ${buttonConfig.className}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAction(campaign.id, buttonConfig.action);
                    }}
                    type="button"
                >
                    {buttonConfig.icon} {buttonConfig.text}
                </button>
                <button
                    onClick={() => onViewDetail(campaign)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-all shadow-sm flex-shrink-0"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const Campaigns = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [initialModalData, setInitialModalData] = useState(null);
    const { triggerPlatformCheck } = useNotifications();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/campaigns`);
            setCampaigns(response.data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setInitialModalData(null);
        setIsModalOpen(true);
    };

    const openEditModal = (campaign) => {
        setInitialModalData(campaign);
        setIsModalOpen(true);
    };

    const handleModalSuccess = (data) => {
        if (initialModalData) {
            // Edit Logic - data is the updated campaign
            setCampaigns(prev => prev.map(c => c.id === data.id ? data : c));
        } else {
            // Create Logic - data is the new campaign
            setCampaigns([data, ...campaigns]);
        }
        // Trigger platform check for notifications
        triggerPlatformCheck();
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'Delete') {
                if (window.confirm("Are you sure you want to delete this campaign?")) {
                    await axios.delete(`${API_BASE_URL}/campaigns/${id}`);
                    setCampaigns(prev => prev.filter(c => c.id !== id));
                }
                return;
            }

            // Determine new status
            let newStatus;
            switch (action) {
                case 'Launch':
                    newStatus = 'Active';
                    break;
                case 'Pause':
                    newStatus = 'Paused';
                    break;
                case 'Resume':
                    newStatus = 'Active';
                    break;
                default:
                    return;
            }

            // Update UI immediately
            setCampaigns(current => current.map(c => 
                c.id === id ? { ...c, status: newStatus } : c
            ));

            // Make API call
            await axios.post(`${API_BASE_URL}/campaigns/${id}/status`, { 
                action: action, 
                status: newStatus 
            });

            // Trigger platform check for notifications
            triggerPlatformCheck();

        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            // Revert on error
            fetchCampaigns();
        }
    };

    const filteredCampaigns = campaigns.filter(c => {
        const name = c.name || '';
        const status = c.status || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Campaign Grid</h1>
                    <p className="text-muted font-medium">Global management of autonomous marketing sequences.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5 mr-2" /> Create Sequence
                </button>
            </div>

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                initialData={initialModalData}
            />

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search sequence identifiers..."
                        className="w-full bg-card border border-default rounded-2xl py-4 pl-12 pr-6 text-primary text-sm font-medium focus:outline-none focus:border-indigo-500/50 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                        className="w-full bg-card border border-default rounded-2xl py-4 pl-12 pr-10 text-primary text-xs font-black uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 shadow-sm transition-all appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Sequences</option>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active Nodes</option>
                        <option value="Paused">Suspended</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-muted font-bold uppercase tracking-widest text-xs">Synchronizing with Agentic Grid...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {filteredCampaigns.map(campaign => (
                        <div key={campaign.id} className="h-80">
                            <CampaignCard
                                campaign={campaign}
                                onAction={handleAction}
                                onViewDetail={setSelectedCampaign}
                                onEdit={openEditModal}
                            />
                        </div>
                    ))}
                    {filteredCampaigns.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-card border-dashed border-2 border-slate-200">
                            <p className="text-slate-400 font-medium italic">No matching sequences found in the active cluster.</p>
                        </div>
                    )}
                </div>
            )}
            {/* Detail Modal */}
            {selectedCampaign && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCampaign.name}</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Autonomous Execution Node: {selectedCampaign.broadcast_log?.confirmation_code || 'PENDING'}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCampaign(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Execution Stats */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-600" /> Agentic Timeline
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedCampaign.timeline?.execution_timeline?.map((m, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-6 h-6 rounded-full border-2 border-indigo-600 flex items-center justify-center bg-white z-10">
                                                        <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                                                    </div>
                                                    {idx !== selectedCampaign.timeline.execution_timeline.length - 1 && (
                                                        <div className="w-0.5 h-full bg-slate-100 group-hover:bg-indigo-100 transition-colors" />
                                                    )}
                                                </div>
                                                <div className="pb-6">
                                                    <p className="text-sm font-black text-slate-800">{m.milestone}</p>
                                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">{m.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deployment Log */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Share2 className="w-4 h-4 text-emerald-600" /> Broadcast Status
                                    </h3>
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                        <div className="space-y-4">
                                            {Object.entries(selectedCampaign.broadcast_log?.deployments || {}).map(([platform, status]) => (
                                                <div key={platform} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                                                    <span className="text-sm font-bold text-slate-700">{platform}</span>
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                                        <CheckCircle className="w-4 h-4" /> {status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Strategy Note</p>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                            "{selectedCampaign.strategy?.strategy}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setSelectedCampaign(null);
                                    openEditModal(selectedCampaign);
                                }}
                                className="px-8 py-4 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95 flex items-center gap-2 mr-auto"
                            >
                                <PenTool className="w-4 h-4" /> Edit Configuration
                            </button>

                            <button
                                onClick={() => { handleAction(selectedCampaign.id, 'Delete'); setSelectedCampaign(null); }}
                                className="px-8 py-4 rounded-2xl border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                            >
                                Terminate Node
                            </button>
                            <button
                                onClick={() => setSelectedCampaign(null)}
                                className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
