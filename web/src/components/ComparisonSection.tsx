import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { X, Check, Clock } from "lucide-react";

const oldWay = [
  "Weeks of manual auth setup",
  "Fighting TanStack configs",
  "Hand-wiring edge databases",
  "Scrappy, amateur layouts",
  "Spaghetti state management",
];

const newWay = [
  "React 19 templates ready",
  "TanStack Router & Query built-in",
  "Secure Hono + D1 setup",
  "Premium, mobile-first design",
  "Optimized, clean architecture",
];

export const ComparisonSection = () => {
  return (
    <section className="py-32 px-6 bg-secondary/10">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">The Comparison</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-[0.9]">
            The Grind <span className="text-muted-foreground/40">vs.</span> The <span className="gradient-text">Flow.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Old Way */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-3xl p-10 border border-destructive/20 bg-destructive/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <X className="w-24 h-24 text-destructive" strokeWidth={3} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center">
                  <X className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">The Old Way</h3>
              </div>
              <ul className="space-y-6">
                {oldWay.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-muted-foreground font-medium">
                    <X className="w-5 h-5 text-destructive/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* New Way */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-hover rounded-3xl p-10 border-primary/20 relative overflow-hidden group bg-primary/5"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Check className="w-24 h-24 text-primary" strokeWidth={3} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl accent-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter gradient-text">Dashboard Kit</h3>
              </div>
              <ul className="space-y-6">
                {newWay.map((item) => (
                  <li key={item} className="flex items-center gap-4 font-bold">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Time Saved Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-2xl px-8 py-4 backdrop-blur-md shadow-xl shadow-primary/5">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
              <span className="font-black uppercase italic tracking-widest text-sm">Launch <span className="text-primary">10x Faster</span> with our kit</span>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};