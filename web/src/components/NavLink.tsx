// src/components/NavLink.tsx

import { useSiteConfig } from '@config/SiteConfigFromDB';

export function NavLink() {
    const { config } = useSiteConfig();
    // Pull navigation items directly from the active module config
    const navItems = config.module?.nav || [];

    return (
        <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
                <a
                    key={item.title}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    {item.title}
                </a>
            ))}
        </div>
    );
}