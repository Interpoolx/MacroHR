import { useEffect } from 'react'
import { useSiteConfig } from '@config/SiteConfigFromDB'

interface SEOProps {
    title?: string
    description?: string
    ogImage?: string
}

export function SEO({ title, description, ogImage }: SEOProps) {
    const config = useSiteConfig()

    useEffect(() => {
        if (!config) return

        const isHomepage = window.location.pathname === '/'
        const siteName = config.name || 'Anything+'

        let finalTitle = ''
        let finalDescription = ''

        if (isHomepage) {
            // Homepage logic: Priority to specific fields, fallback to sitewide defaults
            finalTitle = config.seo?.homepageTitle || siteName
            finalDescription = config.seo?.homepageDescription || config.seo?.descriptionDefault || config.description
        } else {
            // Other pages: Use template and individual title/description
            const titleTemplate = config.seo?.titleTemplate || '%s | {site_name}'
            if (title) {
                finalTitle = titleTemplate.replace(/{site_name}/g, siteName).replace(/%s/g, title)
            } else {
                // Fallback for subpages without specific title
                finalTitle = titleTemplate.replace(/%s\s*\|\s*/g, '').replace(/\s*\|\s*%s/g, '').replace(/{site_name}/g, siteName).trim()
                if (!finalTitle) finalTitle = siteName
            }
            finalDescription = description || config.seo?.descriptionDefault || config.description
        }

        document.title = finalTitle

        // Favicon
        if (config.logo?.favicon) {
            updateLinkTag('icon', config.logo.favicon)
            updateLinkTag('shortcut icon', config.logo.favicon)
            updateLinkTag('apple-touch-icon', config.logo.favicon)
        }

        // Meta Description
        if (finalDescription) {
            updateMetaTag('name', 'description', finalDescription)
            updateMetaTag('property', 'og:description', finalDescription)
        }

        // OG Image
        let finalOgImage = ogImage
        if (!finalOgImage) {
            if (isHomepage) {
                finalOgImage = config.seo?.homepageOgImage || config.seo?.ogImageDefault || config.logo?.url
            } else {
                finalOgImage = config.seo?.ogImageDefault || config.logo?.url
            }
        }

        if (finalOgImage) {
            updateMetaTag('property', 'og:image', finalOgImage)
        }

        // OG Title
        updateMetaTag('property', 'og:title', finalTitle)

    }, [title, description, ogImage, config])

    return null
}

function updateLinkTag(rel: string, href: string) {
    let el = document.querySelector(`link[rel*="${rel}"]`) as HTMLLinkElement
    if (!el) {
        el = document.createElement('link')
        el.rel = rel
        document.head.appendChild(el)
    }
    el.href = href
}

function updateMetaTag(attr: string, value: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${value}"]`)
    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, value)
        document.head.appendChild(el)
    }
    el.setAttribute('content', content)
}
