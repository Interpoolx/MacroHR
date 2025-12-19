import { API_BASE_URL } from './api'
import { siteConfig as staticConfig } from './site'

export const getSiteConfig = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/settings`)
        if (response.ok) {
            const settings = await response.json()
            const dynamicConfig: any = JSON.parse(JSON.stringify(staticConfig))

            settings.forEach((setting: any) => {
                const { key, value } = setting

                // General
                if (key === 'site_name') dynamicConfig.name = value
                if (key === 'site_description') dynamicConfig.description = value
                if (key === 'site_url') dynamicConfig.url = value
                if (key === 'creator') dynamicConfig.creator = value
                if (key === 'keywords') dynamicConfig.keywords = typeof value === 'string' ? value.split(',').map((k: string) => k.trim()) : value
                if (key === 'contact_email') dynamicConfig.contactEmail = value

                // Brand
                if (key === 'brand_text') dynamicConfig.logo.text = value
                if (key === 'brand_icon') dynamicConfig.logo.icon = value
                if (key === 'logo_url') dynamicConfig.logo.url = value
                if (key === 'favicon_url') dynamicConfig.logo.favicon = value

                // Navigation
                if (key === 'nav_main') dynamicConfig.nav = value

                // Social
                if (key === 'social_twitter') dynamicConfig.links.twitter = value
                if (key === 'social_github') dynamicConfig.links.github = value

                // Extension
                if (key === 'chrome_extension_id') dynamicConfig.extension.id = value
                if (key === 'chrome_store_url') dynamicConfig.extension.storeUrl = value
                if (key === 'chrome_version') dynamicConfig.extension.version = value
                if (key === 'chrome_extension_title') dynamicConfig.extension.title = value
                if (key === 'chrome_extension_description') dynamicConfig.extension.description = value
                if (key === 'chrome_extension_long_description') dynamicConfig.extension.longDescription = value
                if (key === 'chrome_extension_privacy_policy') dynamicConfig.extension.privacyPolicy = value
                if (key === 'chrome_extension_setup_guide') dynamicConfig.extension.setupGuide = value
                if (key === 'chrome_extension_category') dynamicConfig.extension.category = value
                if (key === 'chrome_extension_tags') dynamicConfig.extension.tags = typeof value === 'string' ? value.split(',').map((k: string) => k.trim()) : value
                if (key === 'chrome_extension_icons') dynamicConfig.extension.icons = value
                if (key === 'chrome_extension_featured_images') dynamicConfig.extension.featuredImages = value

                // SEO
                if (key === 'seo_title_template') dynamicConfig.seo.titleTemplate = value
                if (key === 'seo_description_default') dynamicConfig.seo.descriptionDefault = value
                if (key === 'og_image_default') dynamicConfig.seo.ogImageDefault = value

                // Backend
                if (key === 'backend_api_url') dynamicConfig.backendApiUrl = value
                if (key === 'cloudflare_url') dynamicConfig.cloudFlareUrl = value
                if (key === 'supabase_url') dynamicConfig.supabase.url = value
                if (key === 'supabase_anon_key') dynamicConfig.supabase.anonKey = value
                if (key === 'db_name') dynamicConfig.dbName = value

                // Finance
                if (key === 'billing_mode') dynamicConfig.billing.mode = value
                if (key === 'polar_access_token') dynamicConfig.billing.accessToken = value
                if (key === 'polar_organization_id') dynamicConfig.billing.organizationId = value
                if (key === 'polar_webhook_secret') dynamicConfig.billing.webhookSecret = value
            })
            return dynamicConfig
        }
    } catch (e) {
        console.error('Failed to load dynamic settings', e)
    }
    return staticConfig
}
