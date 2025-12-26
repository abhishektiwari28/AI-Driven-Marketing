import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [selectedCampaign, setSelectedCampaign] = useState('all');
    const [timeRange, setTimeRange] = useState('30');
    const [campaigns, setCampaigns] = useState([{ id: 'all', name: 'All Campaigns', goal: 'System Wide' }]);

    React.useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns([{ id: 'all', name: 'All Campaigns', goal: 'System Wide' }, ...data]);
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <FilterContext.Provider value={{
            selectedCampaign,
            setSelectedCampaign,
            timeRange,
            setTimeRange,
            campaigns,
            refreshCampaigns: async () => {
                const response = await fetch('http://localhost:8000/api/campaigns');
                const data = await response.json();
                setCampaigns([{ id: 'all', name: 'All Campaigns', goal: 'System Wide' }, ...data]);
            }
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};
