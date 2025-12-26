import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { BarChart3, PieChart, GitBranch, Share2, Filter, Calendar } from 'lucide-react';
import AnalyticsOverview from './AnalyticsOverview';
import AnalyticsFunnel from './AnalyticsFunnel';
import AnalyticsSegmentation from './AnalyticsSegmentation';
import AnalyticsChannel from './AnalyticsChannel';

const Analytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const {
        selectedCampaign,
        setSelectedCampaign,
        timeRange,
        setTimeRange,
        campaigns
    } = useFilter();

    const renderContent = () => {
        const props = { selectedCampaign, timeRange };
        switch (activeTab) {
            case 'overview': return <AnalyticsOverview {...props} />;
            case 'funnel': return <AnalyticsFunnel {...props} />;
            case 'segmentation': return <AnalyticsSegmentation {...props} />;
            case 'channel': return <AnalyticsChannel {...props} />;
            default: return <AnalyticsOverview {...props} />;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">Intelligence Hub</h1>
                        <p className="text-muted font-medium max-w-md">Deep-dive into cross-channel attribution and persona dynamics</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Global Selectors */}
                        <div className="flex items-center bg-card p-1.5 rounded-2xl border border-default shadow-sm shadow-gray-200/50 dark:shadow-black/10">
                            <div className="relative group border-r border-light px-2">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-hover:text-indigo-600 transition-colors" />
                                <select
                                    value={selectedCampaign}
                                    onChange={(e) => setSelectedCampaign(e.target.value)}
                                    className="bg-transparent rounded-xl py-2 pl-8 pr-8 text-[11px] font-black uppercase tracking-widest text-secondary focus:outline-none transition-all appearance-none cursor-pointer min-w-[200px]"
                                >
                                    {campaigns.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative group px-2">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-hover:text-indigo-600 transition-colors" />
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="bg-transparent rounded-xl py-2 pl-8 pr-8 text-[11px] font-black uppercase tracking-widest text-secondary focus:outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="7">Last 7D</option>
                                    <option value="30">Last 30D</option>
                                    <option value="90">Last 90D</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl border border-default w-fit max-w-full">
                    {[
                        { id: 'overview', icon: BarChart3, label: 'Performance Overview' },
                        { id: 'funnel', icon: GitBranch, label: 'Deployment Funnel' },
                        { id: 'segmentation', icon: PieChart, label: 'Persona Intelligence' },
                        { id: 'channel', icon: Share2, label: 'Signal Attribution' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-card text-indigo-600 shadow-md shadow-gray-200/50 dark:shadow-black/20 scale-[1.02] border border-light'
                                : 'text-muted hover:text-secondary hover:bg-white/50 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-muted'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[600px] animate-in slide-in-from-bottom-6 duration-700">
                {renderContent()}
            </div>
        </div>
    );
};

export default Analytics;
