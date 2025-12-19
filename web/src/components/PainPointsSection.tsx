import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { Clock, ShieldAlert, Zap, Layout } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "Boilerplate Burnout",
    description: "Spending weeks on auth, routing, and table setups before writing a single line of your own business logic.",
    emoji: "😫",
  },
  {
    icon: ShieldAlert,
    title: "Maintenance Hell",
    description: "Hand-wiring dozens of dependencies and fighting breaking changes every time you try to update your stack.",
    emoji: "🧨",
  },
  {
    icon: Layout,
    title: "Ugly UI & Design Debt",
    description: "Inconsistent layouts and amateur-looking dashboards that kill your user conversion and brand authority.",
    emoji: "📉",
  },
  {
    icon: Zap,
    title: "Edge Sync Struggles",
    description: "Fighting to make your frontend stay in sync with edge-ready databases like Cloudflare D1 and Supabase.",
    emoji: "🌩️",
  },
];

export const PainPointsSection = () => {
  return (
    <section className="py-32 px-6 relative bg-secondary/20">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">The Problem</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Stop Wasting Time <br />
            On <span className="gradient-text">Manual Setups.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Building a modern SaaS dashboard from scratch is a massive time sink.
            Most developers spend 70% of their time on boilerplate rather than features.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {painPoints.map((point) => (
            <StaggerItem key={point.title}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-hover rounded-3xl p-10 h-full text-center border-primary/5 group"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/15 transition-colors duration-500">
                  <point.icon className="w-10 h-10 text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{point.title}</h3>
                <p className="text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-500">{point.description}</p>
                <span className="text-4xl mt-6 block filter grayscale group-hover:grayscale-0 transition-all duration-500">{point.emoji}</span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};