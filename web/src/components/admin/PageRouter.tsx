import React from 'react';
import { useRouter, Route } from '../utils/router';

// Lazy load pages for better performance
// For now, we'll create simple placeholders if the files don't exist yet
const PlaceholderPage: React.FC<{ name: string }> = ({ name }) => (
    <div className="animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold text-foreground mb-6 transition-all">{name}</h1>
        <div className="p-12 border-2 border-dashed border-border rounded-2xl bg-card/50 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium">Coming Soon: {name} content is being migrated.</p>
        </div>
    </div>
);

const PageRouter: React.FC = () => {
    const { currentRoute } = useRouter();

    const renderPage = () => {
        switch (currentRoute) {
            case 'dashboard':
                return <PlaceholderPage name="Dashboard" />;
            case 'people':
                return <PlaceholderPage name="People Directory" />;
            case 'payslip':
                return <PlaceholderPage name="My Payslips" />;
            case 'attendance':
                return <PlaceholderPage name="Attendance Tracker" />;
            case 'benefits':
                return <PlaceholderPage name="Employee Benefits" />;
            case 'performance':
                return <PlaceholderPage name="Performance Reviews" />;
            case 'personal':
                return <PlaceholderPage name="Personal Information" />;
            case 'job-reference':
                return <PlaceholderPage name="Job References" />;
            case 'documents':
                return <PlaceholderPage name="My Documents" />;
            case 'settings':
                return <PlaceholderPage name="Account Settings" />;
            case 'support':
                return <PlaceholderPage name="Help & Support" />;
            default:
                return <PlaceholderPage name="Dashboard" />;
        }
    };

    return (
        <div className="w-full">
            {renderPage()}
        </div>
    );
};

export default PageRouter;
