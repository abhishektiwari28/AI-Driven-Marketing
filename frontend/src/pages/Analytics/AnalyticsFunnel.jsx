import React from 'react';
import { GitBranch } from 'lucide-react';

const AnalyticsFunnel = ({ selectedCampaign, timeRange }) => {
    const isSingle = selectedCampaign !== 'all';

    const steps = isSingle ? [
        { label: 'Visits', value: '450K', color: 'text-indigo-600' },
        { label: 'Action', value: '24K', color: 'text-emerald-600' }
    ] : [
        { label: 'Signal', value: '1.2M', color: 'text-indigo-600' },
        { label: 'Intent', value: '450K', color: 'text-violet-600' },
        { label: 'Action', value: '24K', color: 'text-emerald-600' }
    ];

    return (
        <div className="glass-card p-16 border border-default flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 min-h-[500px]">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                <GitBranch className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-primary mb-4 tracking-tight">Deployment Pipeline</h2>
            <p className="text-muted max-w-md mb-12 leading-relaxed font-medium">
                Visualizing user velocity for {isSingle ? 'Selected Sequence' : 'Global Network'}. Time-scale: {timeRange} Days.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
                {steps.map((step, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card border border-light shadow-sm hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                        <p className="text-[10px] text-muted font-black uppercase mb-1.5 tracking-widest">{step.label}</p>
                        <p className={`text-2xl font-black ${step.color} tracking-tighter`}>{step.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsFunnel;
