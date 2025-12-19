import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '../components/layout/PageLayout'
import { HeroSection } from '../components/HeroSection'
import { PainPointsSection } from '../components/PainPointsSection'
import { StatsSection } from '../components/StatsSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { FAQSection } from '../components/FAQSection'
import { CTASection } from '../components/CTASection'
import { ComparisonSection } from '../components/ComparisonSection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { DemoSection } from '../components/DemoSection'

export const Route = createFileRoute('/')({
    component: LandingPage,
})

function LandingPage() {
    return (
        <PageLayout>
            <HeroSection />
            <PainPointsSection />
            <StatsSection />
            <FeaturesSection />
            <ComparisonSection />
            <HowItWorksSection />
            <DemoSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
        </PageLayout>
    )
}
