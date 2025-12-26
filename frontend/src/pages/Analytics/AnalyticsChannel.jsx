import React from 'react';
import { Share2 } from 'lucide-react';

const AnalyticsChannel = ({ selectedCampaign, timeRange }) => {
    const isSingle = selectedCampaign !== 'all';
    const channels = isSingle ? ['Direct', 'Social', 'Search'] : ['Direct Signal', 'Search Index', 'Social Network', 'Referral Node'];

    return (
        <div className="glass-card p-16 border border-default flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 min-h-[500px]">
            <div className="w-24 h-24 bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                <Share2 className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-3xl font-black text-primary mb-4 tracking-tight">Signal Attribution</h2>
            <p className="text-muted max-w-md mb-12 leading-relaxed font-medium">
                Correlating touchpoints for {isSingle ? 'Selected Node' : 'Global Ecosystem'} ({timeRange}D).
            </p>
            <div className="flex flex-col gap-4 w-full max-w-lg">
                {channels.map((src, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-card border border-light shadow-sm hover:border-violet-300 dark:hover:border-violet-700 transition-all group">
                        <span className="text-sm font-bold chart-label group-hover:text-violet-600 transition-colors uppercase tracking-tight">{src}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{(40 - i * 8)}%</span>
                            <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(40 - i * 8) * 2}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsChannel;
