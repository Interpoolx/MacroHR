import { siteConfig } from './site'

export const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? siteConfig.live.backendApiUrl : siteConfig.local.backendApiUrl)
