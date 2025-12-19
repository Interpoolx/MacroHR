import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`
          ${sizeClasses[size]}
          border-blue-600/20 border-t-blue-600
          rounded-full animate-[spin_0.8s_linear_infinite]
          shadow-lg shadow-blue-100
        `}
            />
        </div>
    );
};

export default LoadingSpinner;
