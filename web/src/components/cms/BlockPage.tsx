import { BlockRenderer } from '../CmsComponents'
import { useSiteConfig } from '@config'
import { PageLayout } from '../layout/PageLayout'
import { SEO } from '../SEO'

export function BlockPage({ page }: { page: any }) {
    const { config } = useSiteConfig()

    return (
        <PageLayout>
            <SEO title={page.title} description={page.metaDescription} />
            <BlockRenderer blocks={page.content} config={config} />
        </PageLayout>
    )
}
