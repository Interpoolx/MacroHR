import { SpendingData } from '../../types';

export const SpendingChart: React.FC<{ data: SpendingData[] }> = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.salary + d.taxes));

    return (
        <div className="h-64 mt-4 relative flex items-end gap-2 px-2">
            {data.map((item, i) => {
                const salaryHeight = (item.salary / maxVal) * 100;
                const taxesHeight = (item.taxes / maxVal) * 100;

                return (
                    <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                        <div className="w-full flex flex-col justify-end gap-1 h-full pb-6">
                            <div
                                className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary/30 transition-all cursor-help relative"
                                style={{ height: `${taxesHeight}%` }}
                                title={`Taxes: ${item.taxes}`}
                            />
                            <div
                                className="w-full bg-primary rounded-t-sm group-hover:bg-primary/90 transition-all cursor-help relative"
                                style={{ height: `${salaryHeight}%` }}
                                title={`Salary: ${item.salary}`}
                            />
                        </div>
                        <div className="absolute bottom-0 text-[10px] text-muted-foreground font-medium">
                            {item.month}
                        </div>
                    </div>
                );
            })}

            {/* Grid Lines Placeholder */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full border-t border-border/50 border-dashed" />
                ))}
            </div>
        </div>
    );
};
