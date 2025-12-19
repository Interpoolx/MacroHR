import { Eye, Layers, Zap, Download, Palette, Code2 } from 'lucide-react'
import { ComparePlansPage } from '../routes/compare-plans'

// --- Types ---
export type Block = {
    id: string
    type: 'hero' | 'richtext' | 'features' | 'testimonial' | 'pricing' | 'social_proof' | 'html'
    data: any
}

// --- Block Helpers (for dynamic component rendering) ---
// Note: These components are defined later in the file.
// const blockHelpers = {
//     hero: HeroSection,
//     features: FeaturesSection,
//     pricing: PricingSection,
//     richtext: RichTextSection,
//     testimonial: TestimonialsSection,
//     social_proof: SocialProofSection,
//     html: HtmlSection // Assuming a new HtmlSection component will be added
// }

// --- Icons Map ---
const ICON_MAP: Record<string, any> = {
    Eye: <Eye className="text-blue-600" size={32} />,
    Download: <Download className="text-purple-600" size={32} />,
    Palette: <Palette className="text-pink-600" size={32} />,
    Code2: <Code2 className="text-orange-600" size={32} />,
    Layers: <Layers className="text-green-600" size={32} />,
    Zap: <Zap className="text-yellow-500" size={32} />,
}

// --- Main Renderer ---
export function BlockRenderer({ blocks, config }: { blocks: Block[], config: any }) {
    if (!blocks) return null
    return (
        <>
            {blocks.map(block => {
                switch (block.type) {
                    case 'hero':
                        return <HeroSection key={block.id} data={block.data} config={config} />
                    case 'social_proof':
                        return <SocialProofSection key={block.id} data={block.data} config={config} />
                    case 'features':
                        return <FeaturesSection key={block.id} data={block.data} config={config} />
                    case 'pricing':
                        return <PricingSection key={block.id} />
                    case 'testimonial':
                        return <TestimonialsSection key={block.id} data={block.data} config={config} />
                    case 'richtext':
                        return <RichTextSection key={block.id} data={block.data} config={config} />
                    case 'html':
                        return <HtmlSection key={block.id} data={block.data} config={config} />
                    default:
                        return null
                }
            })}
        </>
    )
}

// --- Block Components ---

function HeroSection({ data, config }: { data: any, config: any }) {
    const siteName = config.name || config.site_name || 'Anything+'
    const title = (data.title || '').replace(/{site_name}/g, siteName)
    const subtitle = (data.subtitle || '').replace(/{site_name}/g, siteName)

    return (
        <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
            {data.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100/80 text-gray-600 rounded-full text-xs font-bold mb-8 uppercase tracking-wide border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {data.badge.replace('{version}', config.product.version || '1.0').replace(/{site_name}/g, siteName)}
                </div>
            )}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <a href={config.product.chromeStoreUrl} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-blue-200 hover:-translate-y-1 flex items-center justify-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" className="w-6 h-6" alt="Chrome" />
                    Add to Chrome - It's Free
                </a>
                <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">
                    View Demo
                </a>
            </div>
            {/* Placeholder for Video/Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50 aspect-video group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-6 py-3 bg-white/90 backdrop-blur rounded-full shadow-lg border border-gray-100 flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">Video Demo Placeholder</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

function SocialProofSection({ data, config }: { data: any, config: any }) {
    const siteName = config?.name || config?.site_name || 'Anything+'
    const title = (data.title || "Trusted by designers at").replace(/{site_name}/g, siteName)

    return (
        <section className="py-10 border-y border-gray-100 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">{title}</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
                    {data.companies?.map((c: any, i: number) => (
                        <span key={i} className={`text-xl font-bold ${c.font || 'font-sans'}`}>{c.name}</span>
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeaturesSection({ data, config }: { data: any, config: any }) {
    const siteName = config?.name || config?.site_name || 'Anything+'
    const title = (data.title || '').replace(/{site_name}/g, siteName)
    const subtitle = (data.subtitle || '').replace(/{site_name}/g, siteName)

    return (
        <section id="features" className="py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.items?.map((item: any, i: number) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all group">
                            <div className="mb-6 bg-gray-50 group-hover:bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors">
                                {ICON_MAP[item.icon] || <Zap />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function PricingSection() {
    return <ComparePlansPage />
}

function TestimonialsSection({ data, config }: { data: any, config: any }) {
    const siteName = config?.name || config?.site_name || 'Anything+'
    const title = (data.title || '').replace(/{site_name}/g, siteName)
    const subtitle = (data.subtitle || '').replace(/{site_name}/g, siteName)

    return (
        <section id="testimonials" className="py-24 px-4 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-xl text-gray-500">{subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.items?.map((t: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-300">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                    <p className="text-xs text-blue-600">{t.handle}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function RichTextSection({ data, config }: { data: any, config: any }) {
    const siteName = config?.name || config?.site_name || 'Anything+'
    const text = (data.text || '').replace(/{site_name}/g, siteName)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="prose prose-gray max-w-none whitespace-pre-wrap">
                {text}
            </div>
        </div>
    )
}

function HtmlSection({ data, config }: { data: any, config: any }) {
    // Basic variable replacement
    const siteName = config.name || config.site_name || 'Anything+'
    let content = (data.html || '').replace(/{site_name}/g, siteName)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}
