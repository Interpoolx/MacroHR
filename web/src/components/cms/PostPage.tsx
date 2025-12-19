import { useSiteConfig } from '@shared/config/SiteConfigFromDB'
import { PageLayout } from '../layout/PageLayout'
import { SEO } from '../SEO'

export function PostPage({ page }: { page: any }) {
    const config = useSiteConfig()

    const htmlContent = (page.content?.[0]?.data?.html || '').replace(/{site_name}/g, config.name || 'Anything+')

    return (
        <PageLayout>
            <SEO title={page.title} description={page.metaDescription} />
            <div className="min-h-screen bg-white">
                <article className="max-w-3xl mx-auto px-4 py-16">
                    <header className="mb-12 text-center">
                        <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-4">Blog Post</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{page.title}</h1>
                        <div className="text-gray-500">
                            Published on {new Date(page.updatedAt || Date.now()).toLocaleDateString()}
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none mx-auto text-gray-600">
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                </article>
            </div>
        </PageLayout>
    )
}
