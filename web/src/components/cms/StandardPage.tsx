import { Link } from '@tanstack/react-router'
import { useSiteConfig } from '@config/SiteConfigFromDB'
import { PageLayout } from '../layout/PageLayout'
import { SEO } from '../SEO'

export function StandardPage({ page }: { page: any }) {
    const config = useSiteConfig()

    // Safety check for HTML content
    const htmlContent = (page.content?.[0]?.data?.html || '').replace(/{site_name}/g, config.name || 'Anything+')

    return (
        <PageLayout>
            <SEO title={page.title} description={page.metaDescription} />
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <span className="capitalize">{page.title}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 tracking-tight">{page.title}</h1>

                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </PageLayout>
    )
}
