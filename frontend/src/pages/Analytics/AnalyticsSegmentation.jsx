import React from 'react';
import { Users, GitBranch, Share2 } from 'lucide-react';

const AnalyticsSegmentation = ({ selectedCampaign, timeRange }) => {
    const isSingle = selectedCampaign !== 'all';

    const cohorts = isSingle ? ['Retained', 'Churn-Risk', 'High Intent'] : ['High LTV', 'Engagers', 'Discovery', 'At Risk'];

    return (
        <div className="glass-card p-16 border border-default flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 min-h-[500px]">
            <div className="w-24 h-24 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                <Users className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-3xl font-black text-primary mb-4 tracking-tight">Persona Intelligence</h2>
            <p className="text-muted max-w-md mb-12 leading-relaxed font-medium">
                Autonomous clustering of user behaviors for {isSingle ? 'Selected Node' : 'Global Ecosystem'} ({timeRange}D).
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
                {cohorts.map((group, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card border border-light shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all group">
                        <div className="text-[10px] font-black text-muted uppercase mb-3 tracking-widest group-hover:text-teal-600 transition-colors">{group}</div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${Math.random() * 60 + 20}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsSegmentation;
