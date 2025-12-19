import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSiteConfig } from './dynamicSite'
import { siteConfig as staticConfig } from './site'

type SiteConfig = typeof staticConfig

const SiteConfigContext = createContext<SiteConfig>(staticConfig)

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<SiteConfig>(staticConfig)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const dynamic = await getSiteConfig()
                setConfig(dynamic)
            } finally {
                setIsLoading(false)
            }
        }
        loadConfig()
    }, [])

    return (
        <SiteConfigContext.Provider value={config}>
            {isLoading ? (
                <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : children}
        </SiteConfigContext.Provider>
    )
}

export const useSiteConfig = () => useContext(SiteConfigContext)

/**
 * Reusable Setting component to display a specific value from the dynamic config
 */
export const Setting = ({ path, fallback }: { path: string, fallback?: React.ReactNode }) => {
    const config = useSiteConfig()

    // Simple helper to get nested keys like 'logo.text'
    const getValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    const value = getValue(config, path)
    return <>{value || fallback || ''}</>
}
