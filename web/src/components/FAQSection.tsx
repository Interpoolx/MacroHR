import { AnimatedSection } from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useSiteConfig } from "@config/SiteConfigFromDB";

const DEFAULT_FAQS = [
  {
    question: "What's included in the Dashboard Kit?",
    answer: "You get the full React 19 source code, a high-performance Hono API, pre-configured TanStack Router/Query/Table, and professional Admin & User portal layouts. Everything is production-ready.",
  },
  {
    question: "Is it really 100% Open Source?",
    answer: "Yes! We believe in giving back to the community. You can clone, modify, and use this kit for both personal and commercial SaaS products without any licensing fees.",
  },
];

export const FAQSection = () => {
  const { config } = useSiteConfig();
  const module = config.module;
  const faqs = module.support?.faq?.items || DEFAULT_FAQS;
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">Knowledge Base</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Everything you need to know about the kit and how to start shipping.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass rounded-[2rem] px-8 border-white/5 data-[state=open]:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-black text-xl uppercase italic tracking-tight py-8 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg font-medium pb-8 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
};