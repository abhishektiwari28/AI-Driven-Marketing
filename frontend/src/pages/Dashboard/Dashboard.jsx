import React, { useState } from 'react';
import { LayoutDashboard, Megaphone, LineChart, Cpu, Calendar, Filter, Plus } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import DashboardOverview from './DashboardOverview';
import DashboardCampaigns from './DashboardCampaigns';
import DashboardAnalytics from './DashboardAnalytics';
import DashboardAIInsights from './DashboardAIInsights';
import CreateCampaignModal from '../../components/CreateCampaignModal';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
            case 'overview': return <DashboardOverview {...props} />;
            case 'campaigns': return <DashboardCampaigns {...props} />;
            case 'analytics': return <DashboardAnalytics {...props} />;
            case 'insights': return <DashboardAIInsights {...props} />;
            default: return <DashboardOverview {...props} />;
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
        { id: 'analytics', label: 'Analytics', icon: LineChart },
        { id: 'insights', label: 'AI Insights', icon: Cpu },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-1">Command Center</h1>
                    <p className="text-muted font-medium">Strategic intelligence and deployment console</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Campaign Selector */}
                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-hover:text-indigo-600 transition-colors" />
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="bg-card border border-default rounded-xl py-2.5 pl-10 pr-10 text-sm font-bold text-secondary focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 min-w-[200px]"
                        >
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Range Filter */}
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-hover:text-indigo-600 transition-colors" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-card border border-default text-primary text-sm font-bold rounded-xl pl-12 pr-10 py-3.5 focus:outline-none focus:border-indigo-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                            <option value="3">Last 3 Days</option>
                            <option value="7">Last 7 Days</option>
                            <option value="15">Last 15 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="365">Current Year</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary py-2.5"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Initialize New Campaign</span>
                    </button>
                </div>
            </header>

            <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(data) => {
                    // Optionally refresh global context or just close
                    console.log("Campaign Created from Dashboard:", data);
                    // Force refresh via window or context if needed, but for now just close
                    // In a real app we'd update the context campaigns list.
                    window.location.reload(); // Quick way to ensure context updates for now
                }}
            />

            {/* Tabbed Navigation */}
            <div className="bg-card p-1 rounded-2xl flex overflow-x-auto border border-default shadow-sm shadow-gray-200/50 dark:shadow-black/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                            : 'text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic Content */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
