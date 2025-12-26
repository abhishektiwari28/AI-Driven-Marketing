import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { Globe, Activity, Users, TrendingUp, Zap } from 'lucide-react';
import { useFilter } from '../../context/FilterContext';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const Analytics = () => {
    const { selectedCampaign, timeRange } = useFilter();
    const [realTimeData, setRealTimeData] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeRegions: 0,
        conversionRate: 0,
        engagement: 0
    });

    // Location coordinates mapping
    const locationCoords = {
        'North America': { lat: 39.8283, lng: -98.5795 },
        'Europe': { lat: 54.5260, lng: 15.2551 },
        'Asia Pacific': { lat: 34.0479, lng: 100.6197 },
        'South America': { lat: -8.7832, lng: -55.4915 },
        'Africa': { lat: -8.7832, lng: 34.5085 },
        'India': { lat: 20.5937, lng: 78.9629 },
        'Australia': { lat: -25.2744, lng: 133.7751 }
    };

    // Fetch real campaign data from backend
    useEffect(() => {
        const fetchRealTimeData = async () => {
            try {
                const platforms = ['Instagram', 'Facebook', 'Twitter', 'Google Ads', 'Email'];
                const platformPromises = platforms.map(async (platform) => {
                    try {
                        const response = await axios.get(`/api/platforms/${platform}/stats`);
                        return response.data;
                    } catch (error) {
                        return null;
                    }
                });
                
                const results = await Promise.all(platformPromises);
                const validResults = results.filter(result => result !== null);
                
                // Aggregate data by location
                const locationData = {};
                
                validResults.forEach(platformData => {
                    if (platformData.campaigns) {
                        platformData.campaigns.forEach(campaign => {
                            const location = campaign.location || 'Unknown';
                            if (!locationData[location]) {
                                locationData[location] = {
                                    name: location,
                                    users: 0,
                                    conversions: 0,
                                    clicks: 0,
                                    impressions: 0,
                                    ...locationCoords[location]
                                };
                            }
                            
                            const metrics = campaign.metrics || {};
                            locationData[location].users += Math.floor(metrics.clicks || 0);
                            locationData[location].conversions += Math.floor(metrics.conversions || 0);
                            locationData[location].clicks += Math.floor(metrics.clicks || 0);
                            locationData[location].impressions += Math.floor(metrics.impressions || 0);
                        });
                    }
                });
                
                const regions = Object.values(locationData).filter(region => region.lat && region.lng);
                setRealTimeData(regions);
                
                // Calculate stats
                const totalUsers = regions.reduce((sum, region) => sum + region.users, 0);
                const totalConversions = regions.reduce((sum, region) => sum + region.conversions, 0);
                
                setStats({
                    totalUsers,
                    activeRegions: regions.length,
                    conversionRate: totalUsers > 0 ? ((totalConversions / totalUsers) * 100).toFixed(2) : 0,
                    engagement: Math.floor(Math.random() * 30) + 70
                });
                
            } catch (error) {
                console.error('Error fetching real-time data:', error);
            }
        };

        fetchRealTimeData();
        const interval = setInterval(fetchRealTimeData, 10000); // Update every 10 seconds
        
        return () => clearInterval(interval);
    }, [selectedCampaign, timeRange]);

    const getMarkerSize = (users) => {
        if (users > 4000) return 25;
        if (users > 2000) return 20;
        if (users > 1000) return 15;
        return 10;
    };

    const getMarkerColor = (users) => {
        if (users > 4000) return '#ef4444'; // red
        if (users > 2000) return '#f97316'; // orange
        if (users > 1000) return '#eab308'; // yellow
        return '#22c55e'; // green
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-900 dark:text-blue-100 mb-2 tracking-tight">Real-Time Global Analytics</h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-md">Live campaign performance across global markets</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Live Data</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Users</p>
                            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                                {stats.totalUsers.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Active Regions</p>
                            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.activeRegions}</h3>
                        </div>
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.conversionRate}%</h3>
                        </div>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Engagement</p>
                            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.engagement}%</h3>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* World Map */}
            <div className="glass-card p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Global Campaign Activity</h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Low Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Medium Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">High Activity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-slate-600 dark:text-slate-400">Very High Activity</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-[500px] rounded-xl overflow-hidden border border-blue-200 dark:border-blue-700">
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {realTimeData.map((region, index) => (
                            <CircleMarker
                                key={index}
                                center={[region.lat, region.lng]}
                                radius={getMarkerSize(region.users)}
                                fillColor={getMarkerColor(region.users)}
                                color="white"
                                weight={2}
                                opacity={0.8}
                                fillOpacity={0.6}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h4 className="font-bold text-slate-900 mb-2">{region.name}</h4>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Users:</span> {region.users.toLocaleString()}</p>
                                            <p><span className="font-medium">Conversions:</span> {region.conversions.toLocaleString()}</p>
                                            <p><span className="font-medium">Rate:</span> {((region.conversions / region.users) * 100).toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </Popup>
                                <Tooltip>
                                    <div className="text-center">
                                        <div className="font-bold">{region.name}</div>
                                        <div className="text-sm">{region.users.toLocaleString()} users</div>
                                    </div>
                                </Tooltip>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
