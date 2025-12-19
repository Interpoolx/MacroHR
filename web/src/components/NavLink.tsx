import { useSiteConfig } from '@shared/config/SiteConfigFromDB'

export function NavLink() {
    const config = useSiteConfig()

    return (
        <div className="hidden md:flex items-center gap-8">
            {config.nav.map(item => (
                <a
                    key={item.title}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    {item.title}
                </a>
            ))}
        </div>
    )
}
