import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I shipped my MVP in 3 days. The React 19 + Hono combo is incredibly fast and the pre-built dashboards are pixel-perfect.",
    author: "Sarah Chen",
    role: "Founder",
    company: "ShipIt",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The most comprehensive kit I've ever used. TanStack integration alone saved me at least 2 weeks of manual wiring.",
    author: "Marcus Johnson",
    role: "Senior Engineer",
    company: "Vercel",
    avatar: "MJ",
    rating: 5,
  },
  {
    quote: "Finally a kit that takes edge performance seriously. The Cloudflare D1 + Hono integration is a game-changer for scale.",
    author: "Ana Lopez",
    role: "Full Stack Dev",
    company: "Stripe",
    avatar: "AL",
    rating: 5,
  },
  {
    quote: "Clean, modular, and 100% typed. This isn't just a boilerplate; it's a professional architecture for real SaaS products.",
    author: "Alex Rivera",
    role: "CTO",
    company: "MetaFlow",
    avatar: "AR",
    rating: 5,
  },
  {
    quote: "The dual-dashboard (Admin & User) setup is exactly what I needed. No more building user management from scratch.",
    author: "Chris Park",
    role: "Software Architect",
    company: "Standard",
    avatar: "CP",
    rating: 5,
  },
  {
    quote: "MacroHR changed how I build. I don't start any new project without this stack anymore. It's just too efficient.",
    author: "Priya Sharma",
    role: "Product Lead",
    company: "Airbnb",
    avatar: "PS",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-32 px-6 bg-black/40 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">Social Proof</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Loved by <br />
            Built <span className="gradient-text">Different.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Join 300+ developers shipping products with the MacroHR Kit.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-hover rounded-[2rem] p-10 h-full flex flex-col border-white/5 relative group"
              >
                <div className="absolute top-8 right-8 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="w-12 h-12 text-primary" strokeWidth={3} />
                </div>

                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-xl font-bold mb-10 flex-1 text-foreground leading-[1.4] italic tracking-tight">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                  <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center font-black italic text-lg shadow-xl text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tighter text-lg">{testimonial.author}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {testimonial.role} <span className="text-primary/60 mx-1">@</span> {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};