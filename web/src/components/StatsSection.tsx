import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";

const stats = [
  { value: "100ms", label: "Edge Latency" },
  { value: "40+", label: "UI Components" },
  { value: "100", label: "Lighthouse Score" },
  { value: "20hrs", label: "Saved Per Week" },
];

const partners = ["REACT 19", "HONO", "TANSTACK", "CLOUDFLARE", "SUPABASE", "TAILWIND"];

export const StatsSection = () => {
  return (
    <section className="py-24 px-6 border-y border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary/60 font-black uppercase tracking-[0.4em] mb-4 text-xs">
            Built for High Performance
          </p>
          <h3 className="text-2xl md:text-3xl font-black uppercase italic text-muted-foreground">
            Fully Compatible With Your <span className="text-foreground">Modern Stack</span>
          </h3>
        </AnimatedSection>

        {/* Industry Partners / Tech Stack Logos */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 mb-20">
          {partners.map((partner, i) => (
            <motion.span
              key={partner}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-foreground font-black text-xl md:text-2xl tracking-tighter hover:opacity-100 hover:text-primary transition-all duration-300 cursor-default"
            >
              {partner}
            </motion.span>
          ))}
        </div>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center group">
                <div className="text-6xl md:text-7xl font-black gradient-text mb-4 italic tracking-tighter group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
                <div className="text-muted-foreground font-black uppercase tracking-widest text-xs group-hover:text-primary transition-colors duration-500">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};