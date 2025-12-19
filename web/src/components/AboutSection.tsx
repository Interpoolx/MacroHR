import { useSiteConfig } from '@shared/config/SiteConfigFromDB'

export function AboutSection() {
    const config = useSiteConfig()

    return (
        <section id="about" className="py-24 px-4 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Bridging the gap between Design and Code.</h2>
                <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12 font-light">
                    {config.name} was built to eliminate the tedious back-and-forth between inspecting elements and writing code.
                    We believe that understanding the anatomy of the web should be intuitive, instant, and beautiful.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-serif font-bold text-2xl">S</div>
                    <div className="text-left">
                        <p className="font-bold text-white">Built by {config.creator}</p>
                        <p className="text-sm text-gray-500">Founder & Lead Developer</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
