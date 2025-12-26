import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart3, Zap, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const API_BASE_URL = '/api';

const MetricCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="glass-card p-6 border border-default flex items-start justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all shadow-sm">
        <div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">{label}</p>
            <h4 className="text-3xl font-black metric-number mb-1 group-hover:text-indigo-600 transition-colors tracking-tighter">{value}</h4>
            <p className="text-xs text-muted font-medium">{subtext}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-card border border-light ${colorClass} transition-transform group-hover:scale-110 shadow-inner`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const AIMarketing = () => {
    const [platformData, setPlatformData] = useState([]);
    const [bestPlatform, setBestPlatform] = useState(null);
    const [loading, setLoading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);

    const platforms = [
        { name: 'Instagram', color: '#E1306C' },
        { name: 'Facebook', color: '#1877F2' },
        { name: 'Twitter', color: '#1DA1F2' },
        { name: 'Email', color: '#34D399' },
        { name: 'Google Ads', color: '#4285F4' },
    ];

    useEffect(() => {
        fetchPlatformData();
    }, []);

    const fetchPlatformData = async () => {
        setLoading(true);
        try {
            // First try the API
            const response = await axios.get(`${API_BASE_URL}/platforms/all/stats`);
            let allPlatformStats = response.data;
            
            console.log('Raw platform stats:', allPlatformStats);
            
            // If API returns empty or single object, fallback to individual calls
            if (!Array.isArray(allPlatformStats) || allPlatformStats.length === 0) {
                console.log('Fallback to individual platform calls');
                const platformPromises = platforms.map(async (platform) => {
                    try {
                        const response = await axios.get(`${API_BASE_URL}/platforms/${platform.name}/stats`);
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching ${platform.name}:`, error);
                        return null;
                    }
                });
                
                const results = await Promise.all(platformPromises);
                allPlatformStats = results.filter(stat => stat !== null);
            }
            
            // Transform data for chart
            const chartData = allPlatformStats.map(platformStat => {
                const platform = platforms.find(p => p.name === platformStat.platform);
                const metrics = platformStat.metrics || {};
                
                return {
                    platform: platformStat.platform,
                    clicks: Math.round(metrics.clicks || 0),
                    impressions: Math.round(metrics.impressions || 0),
                    conversions: Math.round(metrics.conversions || 0),
                    reach: Math.round(metrics.impressions || 0),
                    roiIndex: parseFloat((metrics.roi || 0).toFixed(1)),
                    spend: Math.round(metrics.cost || 0),
                    color: platform ? platform.color : '#6B7280'
                };
            });
            
            // Sort platforms by total (clicks + impressions + conversions) descending
            chartData.sort((a, b) => {
                const totalA = a.clicks + a.impressions + a.conversions;
                const totalB = b.clicks + b.impressions + b.conversions;
                return totalB - totalA;
            });
            
            console.log('Transformed chart data:', chartData);
            
            // Filter out platforms with no meaningful data
            const validData = chartData.filter(platform => 
                platform.clicks > 0 || platform.impressions > 0 || platform.conversions > 0
            );
            
            setPlatformData(validData.length > 0 ? validData : chartData);
            
            // Calculate best platform based on composite score
            if (chartData.length > 0) {
                const best = chartData.reduce((prev, current) => {
                    const prevTotal = prev.clicks + prev.impressions + prev.conversions;
                    const currentTotal = current.clicks + current.impressions + current.conversions;
                    return currentTotal > prevTotal ? current : prev;
                });
                setBestPlatform(best);
            }
        } catch (error) {
            console.error("Error fetching platform data:", error);
            // Fallback to empty data
            setPlatformData([]);
        } finally {
            setLoading(false);
        }
    };

    const runOptimization = async () => {
        setOptimizing(true);
        try {
            await axios.post(`${API_BASE_URL}/campaigns/1/optimize`);
            fetchPlatformData();
        } catch (error) {
            console.error("Error optimizing:", error);
        } finally {
            setOptimizing(false);
        }
    };

    const formatTooltipValue = (value, name) => {
        if (name === 'Impressions' && value > 1000) {
            return [`${(value / 1000).toFixed(1)}K`, name];
        }
        return [value.toLocaleString(), name];
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">AI Deployment Center</h1>
                    <p className="text-muted font-medium">Global autonomous node orchestration for campaign performance.</p>
                </div>
                <button
                    onClick={runOptimization}
                    disabled={optimizing}
                    className={`btn-primary px-8 py-4 shadow-xl shadow-indigo-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${optimizing ? 'opacity-70 animate-pulse' : ''}`}
                >
                    <Zap className="w-4 h-4" /> {optimizing ? 'Optimizing Matrix...' : 'Optimize Matrix'}
                </button>
            </header>

            {/* Platform Performance Chart */}
            <div className="glass-card border border-default bg-card backdrop-blur-sm shadow-2xl overflow-hidden">
                {/* Chart Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-8 py-6 border-b border-default">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                                <BarChart2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary tracking-tight">Platform Performance Analytics</h2>
                                <p className="text-secondary text-sm font-medium mt-1">Comprehensive metrics across all marketing channels</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted font-medium uppercase tracking-wider">Total Platforms</div>
                            <div className="text-2xl font-bold metric-number">{platformData.length}</div>
                        </div>
                    </div>
                </div>

                {/* Chart Content */}
                <div className="p-8">
                    {loading ? (
                        <div className="h-[600px] flex items-center justify-center">
                            <div className="text-muted flex items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-indigo-600"></div>
                                <span className="text-lg font-medium">Loading platform data...</span>
                            </div>
                        </div>
                    ) : platformData.length > 0 ? (
                        <div className="space-y-6">
                            {/* Chart Metrics Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-gradient-to-b from-blue-400 to-blue-600 rounded"></div>
                                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Total Clicks</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                                        {platformData.reduce((sum, p) => sum + p.clicks, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-gradient-to-b from-orange-400 to-orange-600 rounded"></div>
                                        <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">Total Impressions</span>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                                        {platformData.reduce((sum, p) => sum + p.impressions, 0).toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-100 dark:border-green-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-600 rounded"></div>
                                        <span className="text-sm font-semibold text-green-900 dark:text-green-300">Total Conversions</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-900 dark:text-green-300">
                                        {platformData.reduce((sum, p) => sum + p.conversions, 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="h-[600px] w-full bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 rounded-xl border border-default shadow-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={platformData} 
                                        margin={{ left: 60, right: 60, top: 40, bottom: 100 }}
                                        barCategoryGap={30}
                                    >
                                        <XAxis 
                                            dataKey="platform" 
                                            tick={{ fontSize: 13, fontWeight: '700', fill: 'var(--chart-text)', angle: -45, textAnchor: 'end' }}
                                            axisLine={{ stroke: 'var(--chart-grid)', strokeWidth: 2 }}
                                            tickLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
                                            height={80}
                                            interval={0}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12, fontWeight: '600', fill: 'var(--chart-text)' }}
                                            axisLine={{ stroke: 'var(--chart-grid)', strokeWidth: 2 }}
                                            tickLine={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }}
                                            allowDecimals={false}
                                            domain={[0, 'dataMax + 1000']}
                                            tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(0)}K` : value}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--tooltip-bg)', 
                                                border: '1px solid var(--tooltip-border)', 
                                                borderRadius: '12px',
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backdropFilter: 'blur(8px)',
                                                color: 'var(--tooltip-text)'
                                            }}
                                            labelStyle={{ color: 'var(--chart-legend)', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}
                                            formatter={(value, name) => [
                                                <span style={{ color: name === 'Clicks' ? '#3b82f6' : name === 'Impressions' ? '#f97316' : '#22c55e' }}>
                                                    {value.toLocaleString()}
                                                </span>, 
                                                name
                                            ]}
                                        />
                                        <Legend 
                                            wrapperStyle={{ 
                                                paddingTop: '30px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: 'var(--chart-legend)'
                                            }}
                                            iconType="rect"
                                            iconSize={12}
                                        />
                                        <Bar 
                                            dataKey="clicks" 
                                            fill="url(#clicksGradient)" 
                                            name="Clicks"
                                            radius={[4, 4, 0, 0]}
                                            minPointSize={8}
                                        />
                                        <Bar 
                                            dataKey="impressions" 
                                            fill="url(#impressionsGradient)" 
                                            name="Impressions"
                                            radius={[4, 4, 0, 0]}
                                            minPointSize={8}
                                        />
                                        <Bar 
                                            dataKey="conversions" 
                                            fill="url(#conversionsGradient)" 
                                            name="Conversions"
                                            radius={[4, 4, 0, 0]}
                                            minPointSize={8}
                                        />
                                        <defs>
                                            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8}/>
                                            </linearGradient>
                                            <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#ea580c" stopOpacity={0.8}/>
                                            </linearGradient>
                                            <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8}/>
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                            <div className="text-slate-400 text-lg">No platform data available</div>
                            <button 
                                onClick={fetchPlatformData}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Retry Loading Data
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Best Platform KPIs */}
            {bestPlatform && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            label="Platform Reach"
                            value={`${(bestPlatform.reach / 1000).toFixed(1)}K`}
                            subtext="Total impressions"
                            icon={Users}
                            colorClass="text-indigo-600"
                        />
                        <MetricCard
                            label="Conversion Yield"
                            value={bestPlatform.conversions}
                            subtext="Goal completions"
                            icon={TrendingUp}
                            colorClass="text-emerald-600"
                        />
                        <MetricCard
                            label="ROI Index"
                            value={`${bestPlatform.roiIndex.toFixed(1)}x`}
                            subtext="Efficiency score"
                            icon={BarChart3}
                            colorClass="text-violet-600"
                        />
                        <MetricCard
                            label="Platform Spend"
                            value={`₹${bestPlatform.spend.toLocaleString()}`}
                            subtext="Total investment"
                            icon={Zap}
                            colorClass="text-amber-600"
                        />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <span className="text-sm font-medium text-muted">Best overall:</span>
                        <span className="text-sm font-black chart-label">{bestPlatform.platform}</span>
                        <div 
                            className="w-8 h-1 rounded-full" 
                            style={{ backgroundColor: bestPlatform.color }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIMarketing;
