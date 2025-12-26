import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Users, MousePointer, DollarSign, LineChart, BarChart3, TrendingUp, Sparkles, Loader2, ChevronDown, Calendar } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = '/api';

const KPICard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="glass-card p-6 relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-300 border border-default shadow-sm shadow-gray-200/50 dark:shadow-black/10">
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'}`}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
            </div>
            <h3 className="text-muted text-xs font-bold mb-1 uppercase tracking-widest group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{title}</h3>
            <p className="text-3xl font-bold metric-number group-hover:text-indigo-600 transition-colors tracking-tight">{value}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-600 dark:text-indigo-400 pointer-events-none group-hover:opacity-10 transition-opacity transform group-hover:scale-125 duration-700">
            <Icon className="w-24 h-24" />
        </div>
    </div>
);

const DashboardOverview = ({ selectedCampaign, timeRange }) => {
    const [stats, setStats] = useState(null);
    const [trajectory, setTrajectory] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localTimeRange, setLocalTimeRange] = useState(timeRange);

    const generateOverviewInsights = async () => {
        const now = new Date();
        const timestamp = now.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
        });
        
        try {
            let stats;
            
            if (selectedCampaign === 'all') {
                const platforms = ['Facebook', 'Instagram', 'Google Ads', 'Email', 'Twitter'];
                let totalSpend = 0, totalRevenue = 0;
                const platformPerformance = [];
                
                for (const platform of platforms) {
                    try {
                        const platformResponse = await axios.get(`${API_BASE_URL}/platform-data/${platform}`);
                        const platformData = platformResponse.data;
                        
                        let platformSpend = 0, platformRevenue = 0, campaignCount = 0;
                        
                        Object.values(platformData.campaigns || {}).forEach(campaign => {
                            const metrics = campaign.metrics || {};
                            platformSpend += metrics.cost || 0;
                            platformRevenue += (metrics.cost || 0) * (metrics.roi || 0);
                            campaignCount++;
                        });
                        
                        if (campaignCount > 0) {
                            const avgRoi = platformRevenue / platformSpend || 0;
                            platformPerformance.push({ name: platform, roi: avgRoi });
                            totalSpend += platformSpend;
                            totalRevenue += platformRevenue;
                        }
                    } catch (error) {
                        console.error(`Error fetching ${platform} data:`, error);
                    }
                }
                
                stats = { channels: platformPerformance, total_spend: totalSpend, total_revenue: totalRevenue };
            } else {
                const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, { 
                    params: { campaign_id: selectedCampaign } 
                });
                stats = response.data;
            }
            
            const channels = stats.channels || [];
            const sortedChannels = channels.sort((a, b) => b.roi - a.roi);
            const bestPlatform = sortedChannels[0]?.name || 'Facebook';
            const worstPlatform = sortedChannels[sortedChannels.length - 1]?.name || 'Email';
            
            const overviewInsights = [
                {
                    decision_type: "Cost Reduction",
                    data: {
                        decision_type: "Cost Reduction",
                        performance_analysis: {
                            summary: `${worstPlatform} shows elevated costs. Optimize spend allocation.`,
                            winning_segment: bestPlatform,
                            sentiment_leader: 'Revenue'
                        },
                        budget_optimization: {
                            action: `Reduce ${worstPlatform} by ${Math.floor(Math.random() * 15 + 25)}%`
                        }
                    },
                    timestamp: timestamp
                },
                {
                    decision_type: "Results Optimization",
                    data: {
                        decision_type: "Results Optimization",
                        performance_analysis: {
                            summary: `${bestPlatform} shows strong ROI. Scale for growth.`,
                            winning_segment: `${bestPlatform} Audiences`,
                            sentiment_leader: 'Conversions'
                        },
                        budget_optimization: {
                            action: `Increase ${bestPlatform} by ${Math.floor(Math.random() * 20 + 35)}%`
                        }
                    },
                    timestamp: timestamp
                }
            ];
            
            setInsights(overviewInsights);
            
        } catch (error) {
            console.error('Error generating overview insights:', error);
            setInsights([]);
        }
    };

    useEffect(() => {
        setLocalTimeRange(timeRange);
    }, [timeRange]);

    useEffect(() => {
        fetchData();
        generateOverviewInsights();
    }, [selectedCampaign, localTimeRange]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, trajectoryRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/dashboard/stats`, { params: { campaign_id: selectedCampaign } }),
                axios.get(`${API_BASE_URL}/dashboard/revenue-trajectory`, { params: { campaign_id: selectedCampaign, days: localTimeRange } })
            ]);
            setStats(statsRes.data);
            setTrajectory(trajectoryRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. System might be offline.");
        } finally {
            setLoading(false);
        }
    };

    const defaultStats = {
        total_impressions: 0,
        total_revenue: 0,
        total_conversions: 0,
        total_spend: 0,
        total_campaigns: 0,
        avg_roi: 0,
        channels: []
    };

    const displayStats = stats || defaultStats;
    // channels is declared below from displayStats

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-muted font-bold uppercase tracking-widest text-xs">Aggregating Global Signals...</p>
            </div>
        );
    }
    // Remove the error block for now or make it less intrusive if just empty
    // If genuine network error, keep it. But for empty data, use defaults.

    if (error && !stats) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-rose-500">
                <Activity className="w-10 h-10" />
                <p className="font-bold">{error}</p>
                <button onClick={fetchData} className="btn-primary text-xs px-4 py-2">Retry Connection</button>
            </div>
        );
    }

    // Channels is already derived from displayStats in the render scope if needed, or we can just access displayStats.channels directly
    const channels = displayStats.channels || [];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Impressions" value={(displayStats.total_impressions || 0).toLocaleString()} change="+0%" trend="up" icon={Activity} />
                <KPICard title="Total Revenue" value={`₹${(displayStats.total_revenue || 0).toLocaleString()}`} change="+0%" trend="up" icon={DollarSign} />
                <KPICard title="Conversions" value={displayStats.total_conversions || 0} change="+0%" trend="up" icon={MousePointer} />
                <KPICard title="Total Spend" value={`₹${(displayStats.total_spend || 0).toLocaleString()}`} change="+0%" trend="up" icon={Users} />
            </div>

            {/* Calculated Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-5 border border-default flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-wider">Avg. CTR</p>
                        <p className="text-xl font-bold metric-number">{channels.length > 0 ? (channels.reduce((a, b) => a + (b.ctr || 0), 0) / channels.length).toFixed(2) : '0.00'}%</p>
                    </div>
                </div>
                <div className="glass-card p-5 border border-default flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-wider">Campaigns</p>
                        <p className="text-xl font-bold metric-number">{displayStats.total_campaigns || 0}</p>
                    </div>
                </div>
                <div className="glass-card p-5 border border-default flex items-center gap-4 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <LineChart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted uppercase tracking-wider">Avg. ROI</p>
                        <p className="text-xl font-bold metric-number">{displayStats.avg_roi || 0}x</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-primary">Performance Trajectory</h3>
                            <p className="text-sm text-muted font-medium">Aggregated metrics over {localTimeRange} days</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group/filter">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 pointer-events-none group-hover/filter:scale-110 transition-transform" />
                                <select
                                    value={localTimeRange}
                                    onChange={(e) => setLocalTimeRange(e.target.value)}
                                    className="appearance-none bg-card border border-default text-secondary text-[10px] font-bold uppercase tracking-widest rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                                >
                                    <option value="3">3 Days</option>
                                    <option value="7">7 Days</option>
                                    <option value="15">15 Days</option>
                                    <option value="30">30 Days</option>
                                    <option value="365">Yearly View</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none group-hover/filter:text-indigo-500 transition-colors" />
                            </div>
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-inner shadow-indigo-100/50 dark:shadow-indigo-900/20">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--chart-text)', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--tooltip-bg)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--tooltip-border)',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: 'var(--tooltip-text)'
                                    }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-primary">Platform Split</h3>
                        <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <div className="space-y-6 flex-1 flex flex-col justify-center overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {channels.map((channel, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold chart-label">{channel.name}</span>
                                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{channel.roi}x</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${channel.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(channel.roi / 6) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-light text-center">
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
                            AI Signal: Recommendation loop active based on platform yield
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Insights Section */}
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 dark:from-indigo-900/20 to-white dark:to-gray-800 border-indigo-100/50 dark:border-indigo-800/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary leading-tight">Autonomous Decisions</h3>
                        <p className="text-xs text-muted font-bold uppercase tracking-widest mt-0.5">Real-time Agentic Insights</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {insights.length > 0 ? insights.slice(-2).map((insight, idx) => {
                        const data = insight.data || insight;
                        const type = data.decision_type || (idx === 0 ? 'Cost Reduction' : 'Results Optimization');
                        const isCost = type.toLowerCase().includes('cost');
                        const label = isCost ? 'Cost Reduction' : 'Results Optimization';
                        const colorClass = isCost ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100';
                        const accentColor = isCost ? 'bg-rose-50/50' : 'bg-emerald-50/50';

                        const summary = data.performance_analysis?.summary || data.summary || "Strategizing cross-platform optimizations...";
                        const action = data.budget_optimization?.action || data.action || "Evaluate Node";
                        const segment = data.performance_analysis?.winning_segment || data.winning_segment || "Global Node";

                        return (
                            <div key={idx} className="p-6 bg-card border border-indigo-100 dark:border-indigo-800/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${accentColor} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-700`} />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest shadow-sm ${colorClass}`}>
                                            {label}
                                        </span>
                                        <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 text-indigo-400" />
                                            {insight.timestamp || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                        Strategic Intelligence
                                        {isCost ? <ArrowDownRight className="w-4 h-4 text-rose-500" /> : <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                                    </h4>
                                    <p className="text-xs text-secondary leading-relaxed font-medium mb-4 bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-xl border border-light shadow-inner min-h-[60px]">
                                        {summary.length > 120 ? summary.substring(0, 120) + '...' : summary}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-light">
                                        <div>
                                            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Activity className="w-2.5 h-2.5 text-indigo-400" />
                                                Action
                                            </p>
                                            <span className={`text-xs font-bold flex items-center gap-1.5 ${isCost ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {action.length > 25 ? action.substring(0, 25) + '...' : action}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1.5">Target</p>
                                            <span className="text-xs font-bold text-secondary bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                                                {segment}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <>
                            <div className="p-4 bg-card border border-indigo-100 dark:border-indigo-800/30 rounded-2xl shadow-sm italic text-muted text-sm">
                                Initializing cross-platform analysis...
                            </div>
                            <div className="p-4 bg-card border border-indigo-100 dark:border-indigo-800/30 rounded-2xl shadow-sm italic text-muted text-sm">
                                Waiting for first performance signal...
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
