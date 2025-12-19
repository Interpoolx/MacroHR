import { Project } from '../../types';

export const ProjectCard: React.FC<Project> = ({ name, description, logo, totalMembers, dueDate, progress }) => {
    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent flex items-center justify-center border border-border">
                    {logo ? (
                        <img src={logo} alt={name} className="w-6 h-6 object-contain" />
                    ) : (
                        <div className="text-lg font-bold text-primary">{name[0]}</div>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h4>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                        {[...Array(Math.min(3, totalMembers))].map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-accent flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(65 + i)}
                            </div>
                        ))}
                        {totalMembers > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-card bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                +{totalMembers - 3}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Due: {dueDate}</p>
                </div>
            </div>
        </div>
    );
};
