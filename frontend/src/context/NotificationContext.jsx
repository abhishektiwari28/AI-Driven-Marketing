import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [previousPlatformRankings, setPreviousPlatformRankings] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [monitoringInterval, setMonitoringInterval] = useState(null);
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);
    const [hasShownInitialNotification, setHasShownInitialNotification] = useState(false);

    const addNotification = (message, type = 'info') => {
        const newNotification = {
            id: Date.now(),
            message,
            timestamp: new Date().toLocaleTimeString(),
            type
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        console.log('🔔 Notification added:', message, type);
        
        // Show toast notification directly on screen
        setToastNotification(newNotification);
        setTimeout(() => setToastNotification(null), 5000);
        
        // Don't show bell popup when toast is showing
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const checkPlatformChanges = async () => {
        try {
            console.log('🔍 Checking platform changes...');
            const response = await axios.get('/api/platforms/all/stats');
            let allPlatformStats = response.data;
            
            if (!Array.isArray(allPlatformStats) || allPlatformStats.length === 0) {
                const platforms = ['Instagram', 'Facebook', 'Twitter', 'Google Ads', 'Email'];
                const platformPromises = platforms.map(async (platform) => {
                    try {
                        const response = await axios.get(`/api/platforms/${platform}/stats`);
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching ${platform} stats:`, error);
                        return null;
                    }
                });
                const results = await Promise.all(platformPromises);
                allPlatformStats = results.filter(stat => stat !== null);
            }
            
            if (allPlatformStats.length > 0) {
                const chartData = allPlatformStats.map(platformStat => {
                    const metrics = platformStat.metrics || {};
                    const totalScore = (metrics.clicks || 0) + (metrics.impressions || 0) + (metrics.conversions || 0) * 10 + (metrics.roi || 0) * 100;
                    return {
                        platform: platformStat.platform,
                        clicks: Math.round(metrics.clicks || 0),
                        impressions: Math.round(metrics.impressions || 0),
                        conversions: Math.round(metrics.conversions || 0),
                        roi: metrics.roi || 0,
                        totalScore
                    };
                });
                
                // Sort by total score (weighted performance)
                const currentRankings = chartData.sort((a, b) => b.totalScore - a.totalScore);
                console.log('📊 Current rankings:', currentRankings.map(p => `${p.platform}: ${p.totalScore.toFixed(0)}`));
                
                if (previousPlatformRankings.length > 0) {
                    console.log('📊 Previous rankings:', previousPlatformRankings.map(p => `${p.platform}: ${p.totalScore.toFixed(0)}`));
                    
                    // Check if new leader (most important check)
                    const currentLeader = currentRankings[0];
                    const previousLeader = previousPlatformRankings[0];
                    
                    if (currentLeader && previousLeader && currentLeader.platform !== previousLeader.platform) {
                        console.log(`👑 NEW LEADER: ${currentLeader.platform} overtook ${previousLeader.platform}`);
                        addNotification(
                            `👑 ${currentLeader.platform} overtook ${previousLeader.platform} and is now #1 with ${currentLeader.totalScore.toFixed(0)} performance score`,
                            'new-leader'
                        );
                    }
                    
                    // Check for any position changes
                    currentRankings.forEach((current, currentIndex) => {
                        const previousIndex = previousPlatformRankings.findIndex(p => p.platform === current.platform);
                        
                        if (previousIndex !== -1 && previousIndex !== currentIndex) {
                            if (previousIndex > currentIndex) {
                                // Platform moved up
                                const positionsGained = previousIndex - currentIndex;
                                console.log(`🚀 ${current.platform} moved UP ${positionsGained} positions (${previousIndex + 1} → ${currentIndex + 1})`);
                                addNotification(
                                    `🚀 ${current.platform} climbed ${positionsGained} position${positionsGained > 1 ? 's' : ''} to rank #${currentIndex + 1}`,
                                    'platform-rise'
                                );
                            } else {
                                // Platform moved down
                                const positionsLost = currentIndex - previousIndex;
                                console.log(`📉 ${current.platform} moved DOWN ${positionsLost} positions (${previousIndex + 1} → ${currentIndex + 1})`);
                            }
                        }
                    });
                    
                    // Check for significant performance changes
                    currentRankings.forEach(current => {
                        const previous = previousPlatformRankings.find(p => p.platform === current.platform);
                        if (previous && previous.totalScore > 0) {
                            const scoreIncrease = ((current.totalScore - previous.totalScore) / previous.totalScore) * 100;
                            if (Math.abs(scoreIncrease) > 15) {
                                console.log(`📈 ${current.platform} performance change: ${scoreIncrease.toFixed(1)}%`);
                                if (scoreIncrease > 0) {
                                    addNotification(
                                        `📈 ${current.platform} performance surged by ${scoreIncrease.toFixed(1)}%`,
                                        'performance-surge'
                                    );
                                }
                            }
                        }
                    });
                } else {
                    console.log('🎆 Initial platform rankings established');
                }
                
                setPreviousPlatformRankings([...currentRankings]); // Create new array to ensure state change
            }
        } catch (error) {
            console.error('Error checking platform changes:', error);
        }
    };

    // Start monitoring platform changes
    const startMonitoring = () => {
        if (!isMonitoring && !monitoringInterval) {
            console.log('🔄 Starting platform monitoring...');
            setIsMonitoring(true);
            const interval = setInterval(() => {
                console.log('⏰ Monitoring interval triggered at', new Date().toLocaleTimeString());
                checkPlatformChanges();
            }, 10000); // Check every 10 seconds for faster detection
            setMonitoringInterval(interval);
        }
    };

    const stopMonitoring = () => {
        if (monitoringInterval) {
            console.log('⏹️ Stopping platform monitoring...');
            clearInterval(monitoringInterval);
            setMonitoringInterval(null);
            setIsMonitoring(false);
        }
    };

    // Check for changes when campaigns are created/updated
    const triggerPlatformCheck = () => {
        console.log('🔄 Manual platform check triggered');
        checkPlatformChanges();
    };

    // Force a ranking change for testing
    const forceRankingChange = () => {
        console.log('🧪 Forcing ranking change for testing...');
        // Simulate Instagram taking over
        const fakeRankings = [
            { platform: 'Instagram', totalScore: 2500 },
            { platform: 'Google Ads', totalScore: 2400 },
            { platform: 'Facebook', totalScore: 2300 }
        ];
        
        if (previousPlatformRankings.length > 0) {
            const previousLeader = previousPlatformRankings[0];
            if (previousLeader.platform !== 'Instagram') {
                addNotification(
                    `👑 Instagram overtook ${previousLeader.platform} and is now #1!`,
                    'new-leader'
                );
            }
        }
        setPreviousPlatformRankings(fakeRankings);
    };

    useEffect(() => {
        // Initial check and start monitoring
        console.log('🎆 NotificationProvider initialized');
        checkPlatformChanges();
        startMonitoring();
        
        return () => {
            stopMonitoring();
        };
    }, []);

    // Separate useEffect for one-time notification
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('🧪 Auto-triggering test notification...');
            addNotification('👑 Instagram overtook Google Ads and is now #1!', 'new-leader');
        }, 3000);
        
        return () => clearTimeout(timer);
    }, []);

    const value = {
        notifications,
        addNotification,
        clearNotifications,
        triggerPlatformCheck,
        forceRankingChange,
        isMonitoring,
        showNotificationPopup,
        setShowNotificationPopup,
        toastNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};