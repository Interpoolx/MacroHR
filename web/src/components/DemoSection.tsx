import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Copy, Check, Terminal, Layout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoElements = [
  {
    id: "table",
    label: "TanStack Table",
    element: (
      <div className="bg-card border border-border rounded-xl overflow-hidden w-full max-w-md shadow-2xl">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-tighter italic">Recent Users</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/20" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20" />
                <div className="h-2 w-20 bg-muted rounded" />
              </div>
              <div className="h-2 w-12 bg-primary/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    code: `// High-Performance TanStack Table
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});`,
    tech: "TanStack Table v8",
    features: ["Virtual Scrolling", "Multi-Sort", "Global Filter"],
  },
  {
    id: "auth",
    label: "Hono Auth",
    element: (
      <div className="bg-background border border-primary/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 accent-gradient" />
        <h4 className="text-2xl font-black mb-6 uppercase italic italic tracking-tighter">Sign In</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-2 w-16 bg-muted rounded" />
            <div className="h-10 w-full bg-secondary border border-border rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-16 bg-muted rounded" />
            <div className="h-10 w-full bg-secondary border border-border rounded-xl" />
          </div>
          <Button className="w-full accent-gradient font-black uppercase italic py-6">Login</Button>
        </div>
      </div>
    ),
    code: `// Secure Hono + Supabase Auth
app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  const { data, error } = await supabase.auth.signIn();
  return c.json({ user: data.user });
});`,
    tech: "Hono + Supabase",
    features: ["JWT Session", "RBAC Ready", "Edge Optimized"],
  },
  {
    id: "kpi",
    label: "KPI Metrics",
    element: (
      <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-xs shadow-2xl relative group">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Layout className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-black text-primary uppercase tracking-widest">+12.5%</span>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">Total Revenue</p>
          <h4 className="text-4xl font-black italic tracking-tighter">$42,389</h4>
        </div>
        <div className="mt-6 h-1 w-full bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-2/3 accent-gradient" />
        </div>
      </div>
    ),
    code: `// Reusable KPI Component
export const KPICard = ({ label, value, trend }) => {
  return (
    <div className="glass p-8 rounded-3xl">
      <StatLabel>{label}</StatLabel>
      <StatValue>{value}</StatValue>
    </div>
  );
};`,
    tech: "React 19 + Tailwind",
    features: ["Responsive", "Animated", "Themable"],
  },
];

export const DemoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const activeElement = demoElements[activeIndex]!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeElement.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-32 px-6 bg-secondary/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary text-sm font-black tracking-[0.3em] uppercase mb-4 block">Interactive Demo</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
            Built for <span className="gradient-text">Performance.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Explore the core components included in the kit. Clean, modular, and typed.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Preview Panel */}
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3">
                {demoElements.map((el, idx) => (
                  <button
                    key={el.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all italic border ${activeIndex === idx
                      ? "bg-primary text-white border-primary glow-effect"
                      : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      }`}
                  >
                    {el.label}
                  </button>
                ))}
              </div>

              <div className="glass rounded-[2rem] p-12 min-h-[500px] flex items-center justify-center relative bg-black/40 border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.05)_0%,transparent_70%)]" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeElement.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative z-10 w-full flex justify-center"
                  >
                    {activeElement.element}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Code Panel */}
            <div className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-border shadow-2xl h-full">
              <div className="code-header justify-between bg-black/50 p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary/80">{activeElement.tech}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-10 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy Code"}
                </Button>
              </div>

              <div className="p-8 space-y-10">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Source Code</h5>
                  <pre className="font-mono text-sm leading-relaxed text-primary/90 bg-black/30 p-6 rounded-2xl border border-white/5 overflow-x-auto">
                    <code>{activeElement.code}</code>
                  </pre>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Key Features</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeElement.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-secondary/40 p-4 rounded-xl border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};