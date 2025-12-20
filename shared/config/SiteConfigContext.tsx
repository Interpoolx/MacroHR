import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSiteConfig } from './dynamicSite'
import { siteConfig as staticConfig } from './site'
import { type ThemeName, themes } from '../lib/themes'
import { type ModuleName, getCurrentModule } from './modules'

// Define the shape of our config based on static type for now
type SiteConfig = typeof staticConfig

interface SiteConfigContextType {
    config: SiteConfig;
    setTheme: (theme: ThemeName) => void;
    setModule: (module: ModuleName) => void;
    refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined)

const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;

    // Toggle dark/light class
    if (theme.dark) {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
    }

    const tokens = theme.tokens || (theme as any).colors;

    if (!tokens) {
        console.warn(`[Theme Engine] Theme "${themeName}" is missing tokens/colors definition.`, theme);
        return;
    }

    Object.entries(tokens).forEach(([key, value]) => {
        // Map keys like "primaryEnd" to "--color-primary-end" AND "--primary-end"
        const cssKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

        // Tailwind 4 prefers naked variables for tokens, but we use --color- prefix in index.css
        root.style.setProperty(`--color-${cssKey}`, value as string);
        root.style.setProperty(`--${cssKey}`, value as string);

        // Explicit mappings for special cases
        if (key === 'glassBg') root.style.setProperty('--bg-glass', value as string);
        if (key === 'glassBorder') root.style.setProperty('--border-glass', value as string);
        if (key === 'spacingBase') root.style.setProperty('--spacing', value as string);
        if (key === 'radiusBase') root.style.setProperty('--radius', value as string);
        if (key === 'fontSans') root.style.setProperty('--font-sans', value as string);
        if (key === 'fontHeading') root.style.setProperty('--font-heading', value as string);
    });
};

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    // Initial state setup from localStorage or staticConfig
    const [config, setConfig] = useState<SiteConfig>(() => {
        const savedTheme = localStorage.getItem('macrohr_theme') as ThemeName;
        const savedModule = localStorage.getItem('macrohr_module') as ModuleName;

        const baseConfig = { ...staticConfig };

        if (savedTheme && themes[savedTheme]) {
            // @ts-ignore - mutating for initial state
            baseConfig.currentTheme = savedTheme;
        }

        if (savedModule) {
            try {
                const moduleData = getCurrentModule(savedModule);
                if (moduleData) {
                    // @ts-ignore
                    baseConfig.currentModule = savedModule;
                    // @ts-ignore
                    baseConfig.module = moduleData;
                }
            } catch (e) {
                console.error('Failed to load saved module', e);
            }
        }

        return baseConfig;
    });

    const refreshConfig = useCallback(async () => {
        try {
            const dynamic = await getSiteConfig();
            if (!dynamic) return; // Keep existing if null

            setConfig(prev => {
                // Only update if something actually changed to avoid infinite cycles
                const hasChanged = JSON.stringify(dynamic) !== JSON.stringify(staticConfig);
                if (!hasChanged) return prev;

                return {
                    ...dynamic,
                    currentTheme: prev.currentTheme,
                    currentModule: prev.currentModule,
                    module: prev.module
                };
            });
        } catch (e) {
            // Silent fail for dynamic fetch during dev
        }
    }, []);

    const setTheme = useCallback((theme: ThemeName) => {
        if (!themes[theme]) return;
        localStorage.setItem('macrohr_theme', theme);
        setConfig(prev => ({
            ...prev,
            currentTheme: theme
        }));
        // applyTheme is called by useEffect anyway, but let's be immediate
        applyTheme(theme);
    }, []);

    const setModule = useCallback((moduleName: ModuleName) => {
        try {
            const moduleData = getCurrentModule(moduleName);
            if (moduleData) {
                localStorage.setItem('macrohr_module', moduleName);
                setConfig(prev => ({
                    ...prev,
                    currentModule: moduleName,
                    module: moduleData
                }));
            }
        } catch (e) {
            console.error('Failed to set module', e);
        }
    }, []);

    useEffect(() => {
        refreshConfig();
    }, [refreshConfig]);

    // Apply theme on initial load and when it changes
    useEffect(() => {
        applyTheme(config.currentTheme);
    }, [config.currentTheme]);

    return (
        <SiteConfigContext.Provider value={{ config, setTheme, setModule, refreshConfig }}>
            {children}
        </SiteConfigContext.Provider>
    )
}

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (context === undefined) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};
