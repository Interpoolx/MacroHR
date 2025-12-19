import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Copy, Terminal, Zap } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Terminal,
    title: "Clone & Install",
    description: "Get the full repository and install dependencies in seconds. Everything is ready out of the box.",
  },
  {
    number: "2",
    icon: Zap,
    title: "Connect Your Edge",
    description: "Plug in your Cloudflare D1 and Supabase keys. Your high-performance database is ready instantly.",
  },
  {
    number: "3",
    icon: Copy,
    title: "Customize & Launch",
    description: "Add your unique business logic to our pre-wired templates and deploy to the edge globally.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">The Workflow</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Go From Zero <br />
            To <span className="gradient-text">Shipped.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            We've abstracted the complexity so you can focus on building what matters.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-28 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -10 }}
                className="relative text-center group"
              >
                <div className="relative inline-block mb-10">
                  <div className="w-24 h-24 rounded-3xl accent-gradient flex items-center justify-center mx-auto glow-effect group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center font-black italic shadow-xl z-10 transition-transform group-hover:rotate-12">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">{step.title}</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto group-hover:text-foreground transition-colors duration-500">{step.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};