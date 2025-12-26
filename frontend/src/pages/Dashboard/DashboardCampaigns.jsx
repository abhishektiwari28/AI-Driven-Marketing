import React, { useState, useEffect } from 'react';
import { Play, Pause, MoreVertical, TrendingUp, DollarSign, Loader2, ChevronDown, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const CampaignRow = ({ name, status, budget, roi, progress }) => (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-card border border-default hover:border-indigo-400 group transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex gap-4 items-center">
            <div className={`p-2.5 rounded-xl ${status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800'}`}>
                {status === 'Active' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </div>
            <div>
                <h4 className="font-bold text-secondary group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{name}</h4>
                <div className="flex gap-3 mt-1.5">
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1.5 border-r border-light pr-3"><DollarSign className="w-3 h-3" /> ₹{budget.toLocaleString()}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-600" /> {roi}x ROI</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="w-32 space-y-2 hidden md:block">
                <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-widest">
                    <span>Reach</span>
                    <span className="metric-number">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
            </div>
            <button className="p-2 text-muted hover:text-primary transition-colors">
                <MoreVertical className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const DashboardCampaigns = ({ selectedCampaign, timeRange }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('30');
    const [allActivities, setAllActivities] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Time filter options
    const timeFilters = [
        { value: '1', label: 'Last 24 Hours' },
        { value: '3', label: 'Last 3 Days' },
        { value: '7', label: 'Last 7 Days' },
        { value: '15', label: 'Last 15 Days' },
        { value: '30', label: 'Last 30 Days' }
    ];

    // Filter activities based on selected time range
    const filterActivitiesByTime = (activities, days) => {
        const now = new Date();
        const cutoffTime = new Date(now.getTime() - (parseInt(days) * 24 * 60 * 60 * 1000));
        
        return activities.filter(activity => {
            const activityDate = new Date(activity.createdAt || activity.timeline?.start_date || now);
            return activityDate >= cutoffTime;
        });
    };

    useEffect(() => {
        fetchData();
    }, [selectedCampaign]);

    // Filter campaigns when time filter changes
    useEffect(() => {
        if (allActivities.length > 0) {
            const filtered = filterActivitiesByTime(allActivities, selectedTimeFilter);
            setCampaigns(filtered);
        }
    }, [selectedTimeFilter, allActivities]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, { params: { campaign_id: selectedCampaign } });
            const activities = response.data.campaign_summary || [];
            
            // Add mock timestamps if not present for demo
            const activitiesWithTimestamps = activities.map(activity => ({
                ...activity,
                createdAt: activity.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            }));
            
            setAllActivities(activitiesWithTimestamps);
            // Initial filter with selected time range
            const filtered = filterActivitiesByTime(activitiesWithTimestamps, selectedTimeFilter);
            setCampaigns(filtered);
        } catch (error) {
            console.error("Error fetching dashboard campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 glass-card border-default">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-muted font-bold uppercase tracking-widest text-xs">Syncing Active Nodes...</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 border border-default shadow-gray-200/50 dark:shadow-black/10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-primary tracking-tight uppercase">Strategic Activity Grid</h3>
                    <p className="text-xs text-muted font-medium mt-1">Real-time telemetry from active deployments</p>
                </div>
                
                {/* Time Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-card border border-default rounded-xl text-xs font-bold text-secondary hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                        <Calendar className="w-4 h-4" />
                        {timeFilters.find(f => f.value === selectedTimeFilter)?.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-card border border-default rounded-xl shadow-lg z-10 min-w-[160px]">
                            {timeFilters.map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => {
                                        setSelectedTimeFilter(filter.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-all first:rounded-t-xl last:rounded-b-xl ${
                                        selectedTimeFilter === filter.value
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="space-y-4">
                {campaigns.map((c, i) => (
                    <CampaignRow key={i} {...c} />
                ))}
                {campaigns.length === 0 && !loading && (
                    <div className="py-10 text-center border-2 border-dashed border-light rounded-3xl">
                        <p className="text-muted font-medium italic text-sm">
                            No campaign activity found for this period
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCampaigns;

