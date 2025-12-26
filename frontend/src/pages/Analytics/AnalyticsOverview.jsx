import { ArrowUpRight, ArrowDownRight, Users, MousePointer, Mail, Target, BarChart3, TrendingUp, DollarSign, Activity, Globe } from 'lucide-react';

const KPICard = ({ title, value, change, trend, icon: Icon, color }) => (
    <div className="glass-card p-8 relative overflow-hidden group hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-500 border border-default">
        <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl bg-card shadow-sm border border-light ${color} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 ${trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800'}`}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </span>
            </div>
            <h3 className="text-muted text-[10px] font-black mb-1 uppercase tracking-widest">{title}</h3>
            <p className="text-4xl font-black metric-number group-hover:text-indigo-600 transition-colors tracking-tighter">{value}</p>
        </div>
    </div>
);

const AnalyticsOverview = ({ selectedCampaign, timeRange }) => {
    const isSingle = selectedCampaign !== 'all';

    const metrics = isSingle ? {
        conversions: "8.2k",
        personas: "4",
        ctr: "5.32%",
        deployments: "6",
        impressions: "450k",
        clicks: "24k",
        roi: "2.4x"
    } : {
        conversions: "24.5k",
        personas: "12",
        ctr: "4.12%",
        deployments: "18",
        impressions: "1.2M",
        clicks: "48k",
        roi: "3.2x"
    };

    const platformBreakdown = [
        { name: 'Instagram', clicks: '12.5k', impressions: '210k', ctr: '5.9%', spend: '$3,500', roi: '3.8x' },
        { name: 'Facebook', clicks: '8.2k', impressions: '180k', ctr: '4.5%', spend: '$2,800', roi: '3.1x' },
        { name: 'Google Ads', clicks: '15.4k', impressions: '320k', ctr: '4.8%', spend: '$5,200', roi: '4.2x' },
        { name: 'Email', clicks: '4.1k', impressions: '50k', ctr: '8.2%', spend: '$800', roi: '5.6x' },
    ];

    return (
        <div className="space-y-10">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <KPICard
                    title="Conversion Yield"
                    value={metrics.conversions}
                    change="+12.5%"
                    trend="up"
                    icon={Target}
                    color="text-indigo-600"
                />
                <KPICard
                    title="Persona Groups"
                    value={metrics.personas}
                    change="+2"
                    trend="up"
                    icon={Users}
                    color="text-teal-600"
                />
                <KPICard
                    title="Avg. CTR"
                    value={metrics.ctr}
                    change="+0.5%"
                    trend="up"
                    icon={MousePointer}
                    color="text-violet-600"
                />
                <KPICard
                    title="Deployments"
                    value={metrics.deployments}
                    change="-2"
                    trend="down"
                    icon={Mail}
                    color="text-amber-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trends Chart Placeholder */}
                <div className="lg:col-span-2 glass-card p-10 border border-default">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-primary tracking-tight">Performance Correlation Map</h3>
                            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Cross-Channel Telemetry ({timeRange}D)</p>
                        </div>
                        <Activity className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>

                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-light rounded-3xl bg-gray-50/30 dark:bg-gray-800/30">
                        <TrendingUp className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                        <p className="text-sm text-muted font-medium">Aggregated time-series data for {isSingle ? 'Selected Campaign' : 'All Campaigns'}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-light">
                        <div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1.5">Impressions</p>
                            <p className="text-xl font-black metric-number">{metrics.impressions}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1.5">Clicks</p>
                            <p className="text-xl font-black metric-number">{metrics.clicks}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1.5">CTR (%)</p>
                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{metrics.ctr}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1.5">Node ROI</p>
                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{metrics.roi}</p>
                        </div>
                    </div>
                </div>

                {/* Platform Breakdown Section */}
                <div className="glass-card p-10 border border-default bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-primary uppercase tracking-tighter">Platform Sync</h3>
                        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <div className="space-y-5">
                        {platformBreakdown.map((plt, i) => (
                            <div key={i} className="bg-card p-4 rounded-2xl border border-light shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-black chart-label group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{plt.name}</span>
                                    <span className="text-[10px] font-black py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{plt.roi} ROI</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Spend</p>
                                        <p className="text-sm font-black text-secondary">{plt.spend}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest">CT Rate</p>
                                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{plt.ctr}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-card border border-default rounded-2xl text-xs font-black text-muted uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all">
                        Fetch Real-time Meta CAPI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;
