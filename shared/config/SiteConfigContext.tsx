import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSiteConfig } from './dynamicSite'
import { siteConfig as staticConfig } from './site'

// Define the shape of our config based on static type for now
type SiteConfig = typeof staticConfig

const SiteConfigContext = createContext<SiteConfig>(staticConfig)

export const SiteConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<SiteConfig>(staticConfig)

    useEffect(() => {
        const loadConfig = async () => {
            const dynamic = await getSiteConfig()
            // @ts-ignore dynamicConfig is cast to any in helper, so simple set here
            setConfig(dynamic)
        }
        loadConfig()
    }, [])

    return (
        <SiteConfigContext.Provider value={config}>
            {children}
        </SiteConfigContext.Provider>
    )
}

export const useSiteConfig = () => useContext(SiteConfigContext)
