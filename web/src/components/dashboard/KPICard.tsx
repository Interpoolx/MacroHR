import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KPIMetric } from '../../types';

export const KPICard: React.FC<KPIMetric> = ({ title, value, growth, color, data }) => {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-foreground">{value}</h3>
                    <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(growth)}%</span>
                        <span className="text-muted-foreground font-normal ml-1">vs last month</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent group-hover:bg-primary/5 transition-colors">
                    <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                    />
                </div>
            </div>
        </div>
    );
};
