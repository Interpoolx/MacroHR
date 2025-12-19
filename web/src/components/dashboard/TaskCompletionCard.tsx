import React from 'react';

interface TaskCompletionData {
    done: number;
    remaining: number;
    totalDone: number;
    totalTasks: number;
    growth: number;
}

export const TaskCompletionCard: React.FC<TaskCompletionData> = ({ done, totalDone, totalTasks, growth }) => {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Task Completion</h3>

            <div className="flex flex-col items-center py-4 relative">
                <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-accent"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * done) / 100}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-4xl font-bold">{done}%</span>
                    <p className="text-xs text-muted-foreground font-medium">Weekly</p>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-end border-t border-border pt-6">
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Completed</p>
                    <h4 className="text-2xl font-bold mt-1">{totalDone} / {totalTasks}</h4>
                </div>
                <div className="text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-lg text-xs">
                    +{growth}%
                </div>
            </div>
        </div>
    );
};
