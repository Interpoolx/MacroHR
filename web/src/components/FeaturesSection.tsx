import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { Zap, Layout, Shield, Code2, Layers, Cpu } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "React 19 & Hono",
    description: "Built on the latest React 19 features with a blazing fast Hono API running on the edge.",
    emoji: "🚀",
  },
  {
    icon: Layout,
    title: "TanStack Ecosystem",
    description: "Enterprise-grade routing, state management, and tables via TanStack Router, Query, and Table.",
    emoji: "🏗️",
  },
  {
    icon: Shield,
    title: "Dual Dashboards",
    description: "Pre-built, beautiful layouts for both Administrative and Employee portals out of the box.",
    emoji: "🔐",
  },
  {
    icon: Code2,
    title: "Cloudflare D1 SQL",
    description: "Production-ready SQL database integration designed for high performance and global scale.",
    emoji: "💾",
  },
  {
    icon: Cpu,
    title: "Lucide & Framer",
    description: "Stunning visual language with Lucide icons and buttery-smooth Framer Motion animations.",
    emoji: "✨",
  },
  {
    icon: Layers,
    title: "Modular & Extensible",
    description: "Clean, component-based architecture using Tailwind CSS for total design freedom.",
    emoji: "📦",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">Core Features</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Stop Coding <br />
            The <span className="gradient-text">Boring Stuff.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Everything you need to ship a modern SaaS dashboard in record time.
            Built with the best technologies available.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -10 }}
                className="glass-hover rounded-3xl p-10 h-full border-primary/5 group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">{feature.emoji}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium group-hover:text-foreground transition-colors duration-500">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};