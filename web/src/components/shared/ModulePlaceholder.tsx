import React from 'react';
import { motion } from 'framer-motion';
import {
    Construction,
    ChevronRight,
    Layout,
    Database,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useSiteConfig } from '@config/SiteConfigFromDB';
import { DataTable } from '../shared/DataTable';

interface ModulePlaceholderProps {
    title: string;
    slug: string;
}

const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title, slug }) => {
    const { config } = useSiteConfig();
    const moduleName = config.module.name;

    // Mock data for the placeholder table
    const mockData = [
        { id: 1, name: `${title} Item A`, status: 'Draft', date: '2023-12-19' },
        { id: 2, name: `${title} Item B`, status: 'Active', date: '2023-12-20' },
        { id: 3, name: `${title} Item C`, status: 'Pending', date: '2023-12-21' },
    ];

    const mockColumns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Name', accessorKey: 'name' },
        { header: 'Status', accessorKey: 'status' },
        { header: 'Date', accessorKey: 'date' },
    ];

    return (
        <div className="p-8 space-y-8 min-h-screen bg-background transition-colors duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-1"
                >
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary italic">
                        <Construction size={14} />
                        <span>Module Engine / {moduleName}</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                        {title}
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-lg">
                        You've accessed the <span className="text-foreground font-bold italic">{title}</span> section of the {moduleName} module.
                        This workspace is dynamically generated and ready for data integration.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-1 bg-muted/20 border border-border/50 rounded-2xl backdrop-blur-xl"
                >
                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black uppercase italic text-primary tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Dynamic Workspace
                    </div>
                </motion.div>
            </div>

            {/* Stats Grid Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Records', value: '1,284', icon: Database, color: 'text-primary' },
                    { label: 'Active Status', value: 'Verified', icon: ShieldCheck, color: 'text-green-500' },
                    { label: 'Layout Type', value: 'Standard', icon: Layout, color: 'text-blue-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                                <div className="text-3xl font-black italic tracking-tighter text-foreground leading-none">{stat.value}</div>
                            </div>
                            <div className={`p-3 rounded-2xl bg-muted/20 ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Data Table Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm font-black uppercase italic tracking-widest text-foreground">
                        Standard Resource Interface
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                        View Schema <ArrowRight size={12} />
                    </button>
                </div>

                <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
                    <DataTable
                        data={mockData}
                        columns={mockColumns}
                    />
                </div>
            </motion.div>

            {/* Footer Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-8 flex justify-center"
            >
                <div className="px-6 py-3 bg-muted/20 border border-border/30 rounded-full text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-4 italic opacity-60">
                    <div className="flex items-center gap-1">
                        <span>Path:</span>
                        <span className="text-foreground">/user/{slug}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-border" />
                    <div className="flex items-center gap-1">
                        <span>Status:</span>
                        <span className="text-amber-500 uppercase">Dev Mode Placeholder</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ModulePlaceholder;
