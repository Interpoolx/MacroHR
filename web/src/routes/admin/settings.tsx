import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Settings,
  Layout,
  Search,
  Shield,
  Palette,
  Box,
  CreditCard,
  Globe,
  Menu,
  Save,
  Trash2,
  Upload,
  ExternalLink,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Camera,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Info,
  Twitter,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Switch } from "@shared/components/ui/switch";
import { Textarea } from "@shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@shared/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@shared/components/ui/badge";
import { Separator } from "@shared/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from '@shared/config/site';
import { themes } from '@shared/lib/themes';

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
});

const CATEGORIES = [
  { id: 'general', label: 'General', icon: Settings, description: 'Core site identification and settings' },
  { id: 'branding', label: 'Branding', icon: Layout, description: 'Logo, colors, and visual identity' },
  { id: 'seo', label: 'SEO & Meta', icon: Globe, description: 'Search engine optimization and social sharing' },
  { id: 'theme', label: 'Theme Control', icon: Palette, description: 'Interface styles and dark mode' },
  { id: 'modules', label: 'Module Engine', icon: Box, description: 'Enable or switch active functional modules' },
  { id: 'billing', label: 'Billing & Ops', icon: CreditCard, description: 'Cloud infrastructure and financial operations' },
  { id: 'navigation', label: 'Navigation', icon: Menu, description: 'Manage menus and site structure' },
];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Clone config to state for editing
  const [config, setConfig] = useState<any>(JSON.parse(JSON.stringify(siteConfig)));

  const handleUpdate = useCallback((path: string, value: any) => {
    const keys = path.split('.');
    const nextConfig = { ...config };
    let current: any = nextConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key) {
        if (!current[key]) current[key] = {};
        current[key] = { ...current[key] };
        current = current[key];
      }
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
    setConfig(nextConfig);
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    toast.success("Configuration Synchronized", {
      description: "Global settings have been pushed to the edge network.",
      className: "glass border-primary/20"
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-[var(--radius)] border border-border glass shadow-3xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="text-primary h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase tracking-widest text-[8px] h-5">
              Admin Mode
            </Badge>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            System <span className="text-primary italic">Control</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-bold uppercase italic text-[11px] tracking-[0.25em]">Master overrides and infrastructure configuration</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <Button
            variant="ghost"
            className="h-14 px-8 rounded-2xl font-black uppercase italic tracking-widest text-muted-foreground hover:text-foreground"
            onClick={() => setConfig(JSON.parse(JSON.stringify(siteConfig)))}
          >
            Rollback
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 px-10 bg-primary text-primary-foreground border-0 rounded-2xl font-black uppercase italic shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest"
          >
            {isSaving ? (
              <Sparkles className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-3" />
            )}
            {isSaving ? "Syncing..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass bg-card border-border rounded-[var(--radius)] p-4 flex flex-col gap-1 shadow-xl">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative overflow-hidden ${activeTab === cat.id
                    ? 'bg-primary/10 text-foreground border-l-4 border-primary shadow-inner'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-4 border-transparent'
                    }`}
                >
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${activeTab === cat.id ? 'text-primary' : ''}`} />
                  <div className="text-left">
                    <p className={`font-black uppercase italic text-xs tracking-widest leading-none ${activeTab === cat.id ? 'text-primary' : ''}`}>
                      {cat.label}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground/60 mt-1 uppercase line-clamp-1">{cat.description}</p>
                  </div>
                  {activeTab === cat.id && (
                    <div className="absolute right-4">
                      <ChevronRight size={14} className="text-primary animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6 bg-primary/5 border border-border rounded-[var(--radius)] glass">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60 mb-3 italic">Node Status</h4>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase italic text-emerald-500">Global Cluster Online</span>
            </div>
            <Separator className="bg-border/30 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Latency</span>
                <span className="text-foreground">12ms</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Region</span>
                <span className="text-foreground">US-EAST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass border-border rounded-[var(--radius)] shadow-4xl overflow-hidden bg-card/60">
                <CardHeader className="p-10 pb-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center text-primary border border-border shadow-inner">
                      {useMemo(() => {
                        const Icon = CATEGORIES.find(c => c.id === activeTab)?.icon || Settings;
                        return <Icon size={32} />;
                      }, [activeTab])}
                    </div>
                    <div>
                      <CardTitle className="text-4xl font-black uppercase italic tracking-tighter text-foreground">
                        {CATEGORIES.find(c => c.id === activeTab)?.label} <span className="text-primary opacity-50">Config</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-bold uppercase italic text-[11px] tracking-[0.2em] mt-2">
                        {CATEGORIES.find(c => c.id === activeTab)?.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-10 space-y-12">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground px-1">Application Name</Label>
                          <Input
                            value={config.module?.name || ''}
                            onChange={(e) => handleUpdate('module.name', e.target.value)}
                            className="h-14 bg-muted/30 border-border rounded-2xl text-foreground px-6 font-bold"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground px-1">Global URL Hierarchy</Label>
                          <Input
                            value={config.module?.url || ''}
                            onChange={(e) => handleUpdate('module.url', e.target.value)}
                            className="h-14 bg-muted/30 border-border rounded-2xl text-muted-foreground font-mono italic text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground px-1">Module Objective (Description)</Label>
                        <Textarea
                          value={config.module?.description || ''}
                          onChange={(e) => handleUpdate('module.description', e.target.value)}
                          className="min-h-[120px] bg-muted/30 border-border rounded-3xl text-foreground p-6 font-bold leading-relaxed"
                        />
                      </div>

                      <Separator className="bg-border/30" />

                      <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border transition-colors hover:border-primary/20">
                        <div className="space-y-1">
                          <h4 className="font-black uppercase italic text-sm text-foreground tracking-tight">Public Registry</h4>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase italic tracking-widest">Allow search engines to index this specific module</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-primary" />
                      </div>
                    </div>
                  )}

                  {/* Branding Settings */}
                  {activeTab === 'branding' && (
                    <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground text-center block">Primary Logo</Label>
                          <div className="aspect-square bg-muted/30 border-2 border-dashed border-border rounded-[var(--radius)] flex flex-col items-center justify-center gap-4 group hover:border-primary/40 cursor-pointer transition-all">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-xl shadow-primary/5">
                              <Camera size={28} />
                            </div>
                            <Button variant="ghost" className="text-[9px] font-black uppercase italic tracking-widest text-muted-foreground">Select Artifact</Button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground text-center block">Favicon Entity</Label>
                          <div className="aspect-square bg-muted/30 border-2 border-dashed border-border rounded-[var(--radius)] flex flex-col items-center justify-center gap-4 group hover:border-primary/40 cursor-pointer transition-all">
                            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                              <Box size={24} />
                            </div>
                            <Button variant="ghost" className="text-[9px] font-black uppercase italic tracking-widest text-muted-foreground">Upload Icon</Button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground text-center block">Social Card (OG)</Label>
                          <div className="aspect-video col-span-1 bg-muted/30 border-2 border-dashed border-border rounded-[var(--radius)] flex flex-col items-center justify-center gap-4 group hover:border-primary/40 cursor-pointer transition-all">
                            <Layers size={32} className="text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            <Button variant="ghost" className="text-[9px] font-black uppercase italic tracking-widest text-muted-foreground">Drop 1200x630px</Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground px-1">Brand Identifier (Text)</Label>
                          <Input
                            value={config.module?.logo?.text || ''}
                            onChange={(e) => handleUpdate('module.logo.text', e.target.value)}
                            className="h-14 bg-muted/30 border-border rounded-2xl text-foreground px-6 font-black italic tracking-tighter"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SEO Settings */}
                  {activeTab === 'seo' && (
                    <Tabs defaultValue="homepage" className="space-y-8">
                      <TabsList className="bg-muted/30 border border-border p-1 rounded-2xl h-14 w-full">
                        <TabsTrigger value="homepage" className="flex-1 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-black uppercase italic text-[10px] tracking-widest h-full">Homepage</TabsTrigger>
                        <TabsTrigger value="others" className="flex-1 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-black uppercase italic text-[10px] tracking-widest h-full">Secondary Nodes</TabsTrigger>
                        <TabsTrigger value="social" className="flex-1 rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-black uppercase italic text-[10px] tracking-widest h-full">Social & Meta</TabsTrigger>
                      </TabsList>

                      <TabsContent value="homepage" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground">Homepage Meta Title</Label>
                          <Input
                            className="h-14 bg-muted/30 border-border rounded-2xl text-foreground font-bold"
                            value={config.module?.seo?.homepageTitle || ''}
                            onChange={(e) => handleUpdate('module.seo.homepageTitle', e.target.value)}
                          />
                          <p className="text-[9px] font-bold text-slate-500 uppercase italic tracking-widest mt-1">Recommended: 50-60 characters</p>
                        </div>
                        <div className="space-y-3">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground">Homepage Meta Description</Label>
                          <Textarea
                            className="min-h-[100px] bg-muted/30 border-border rounded-2xl text-foreground p-4 font-bold"
                            value={config.module?.seo?.homepageDescription || ''}
                            onChange={(e) => handleUpdate('module.seo.homepageDescription', e.target.value)}
                          />
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase italic tracking-widest mt-1">Recommended: 150-160 characters</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="others" className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground">Title Template</Label>
                            <Input
                              className="h-14 bg-muted/30 border-border rounded-2xl text-foreground font-mono"
                              value={config.module?.seo?.titleTemplate || ''}
                              onChange={(e) => handleUpdate('module.seo.titleTemplate', e.target.value)}
                              placeholder="%s | MacroHR"
                            />
                            <p className="text-[9px] font-bold text-slate-500 uppercase italic tracking-widest mt-1">Use %s for page title placeholder</p>
                          </div>
                          <div className="space-y-3">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground">Default Description</Label>
                            <Input
                              className="h-14 bg-muted/30 border-border rounded-2xl text-foreground font-bold"
                              value={config.module?.seo?.descriptionDefault || ''}
                              onChange={(e) => handleUpdate('module.seo.descriptionDefault', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-4 p-6 bg-muted/30 rounded-[var(--radius)] border border-border">
                          <div className="flex items-center gap-3 mb-2">
                            <Info className="h-4 w-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase italic tracking-widest text-foreground">Inheritance Note</h4>
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-widest leading-relaxed">
                            Subpages will automatically inherit these settings unless explicitly overridden at the node level.
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="social" className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground flex items-center gap-2">
                              <Twitter size={14} /> Twitter Handle
                            </Label>
                            <Input
                              className="h-14 bg-muted/30 border-border rounded-2xl text-foreground font-bold"
                              value={config.module?.seo?.twitterHandle || ''}
                              onChange={(e) => handleUpdate('module.seo.twitterHandle', e.target.value)}
                              placeholder="@macrohr"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground flex items-center gap-2">
                              <Hash size={14} /> Site Name
                            </Label>
                            <Input
                              className="h-14 bg-muted/30 border-border rounded-2xl text-foreground font-bold"
                              value={config.module?.seo?.siteName || ''}
                              onChange={(e) => handleUpdate('module.seo.siteName', e.target.value)}
                              placeholder="MacroHR"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-muted-foreground block">Default OG Image URL</Label>
                          <div className="flex gap-4">
                            <Input
                              className="h-14 bg-muted/30 border-border rounded-2xl text-muted-foreground font-mono text-xs flex-1"
                              value={config.module?.seo?.ogImageDefault || ''}
                              onChange={(e) => handleUpdate('module.seo.ogImageDefault', e.target.value)}
                            />
                            <Button variant="outline" className="h-14 w-14 rounded-2xl border-border bg-muted/30 hover:bg-muted/50 glass">
                              <Upload size={18} className="text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {/* Theme Control */}
                  {activeTab === 'theme' && (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">Active Theme Template</h4>
                          <Select
                            value={config.currentTheme}
                            onValueChange={(value) => handleUpdate('currentTheme', value)}
                          >
                            <SelectTrigger className="h-14 bg-muted/30 border-border rounded-2xl font-black uppercase italic text-[10px] tracking-widest text-foreground">
                              <SelectValue placeholder="Select Theme" />
                            </SelectTrigger>
                            <SelectContent className="glass border-border rounded-2xl p-2 h-64 overflow-y-auto">
                              {Object.entries(themes).map(([id, theme]) => (
                                <SelectItem
                                  key={id}
                                  value={id}
                                  className="rounded-xl focus:bg-primary/20 focus:text-primary font-black uppercase italic text-[10px] tracking-widest p-4 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-4 w-4 rounded-full border border-border" style={{ background: theme.tokens.primary }} />
                                    {theme.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase italic tracking-widest px-1">
                            Selecting a theme will immediately update visual tokens across the entire environment.
                          </p>
                        </div>

                        <div className="space-y-6">
                          <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">Visual Mode</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'dark', label: 'Dark', icon: Moon },
                              { id: 'light', label: 'Light', icon: Sun },
                              { id: 'system', label: 'Auto', icon: Monitor }
                            ].map((mode) => (
                              <button
                                key={mode.id}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${mode.id === 'dark' ? 'border-primary bg-primary/10 text-primary shadow-xl shadow-primary/10' : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/20'
                                  }`}
                              >
                                <mode.icon size={20} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest">{mode.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">System Font</h4>
                        <Select defaultValue="jakarta">
                          <SelectTrigger className="h-14 bg-muted/30 border-border rounded-2xl font-bold">
                            <SelectValue placeholder="Select Typeface" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10 rounded-2xl">
                            <SelectItem value="jakarta" className="font-black uppercase italic text-[10px] tracking-widest p-4">Inter / Plus Jakarta</SelectItem>
                            <SelectItem value="mono" className="font-black uppercase italic text-[10px] tracking-widest p-4">JetBrains Mono</SelectItem>
                            <SelectItem value="system" className="font-black uppercase italic text-[10px] tracking-widest p-4">OS Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">Core UI Metrics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border">
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Border Radius (Legacy)</span>
                            <Badge variant="outline" className="border-border text-foreground font-mono">1.5rem</Badge>
                          </div>
                          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border border-border">
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Accent Intensity</span>
                            <Badge variant="outline" className="border-border text-foreground font-mono">High (Glow)</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-primary/10 rounded-[var(--radius)] border border-primary/20 shadow-xl shadow-primary/5">
                        <div className="flex gap-4 items-center">
                          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                            <Moon size={24} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black uppercase italic text-sm text-foreground tracking-tight">Force Pro Dark Mode</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase italic tracking-widest">Enforce system-wide dark environment by default</p>
                          </div>
                        </div>
                        <Switch checked />
                      </div>
                    </div>
                  )}

                  {/* Module Selection */}
                  {activeTab === 'modules' && (
                    <div className="space-y-8 text-center py-10">
                      <div className="w-24 h-24 bg-primary/10 rounded-[var(--radius)] flex items-center justify-center text-primary border border-primary/20 mx-auto shadow-2xl shadow-primary/10">
                        <Box size={48} />
                      </div>
                      <div className="max-w-md mx-auto space-y-4">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">
                          Engine <span className="text-primary">Ecosystem</span>
                        </h3>
                        <p className="text-muted-foreground font-bold uppercase italic text-[10px] tracking-widest leading-relaxed">
                          Currently synchronized with the <span className="text-primary font-black">{siteConfig.currentModule.toUpperCase()}</span> core.
                          Module switching requires an engine restart and edge propagation.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        <div className="p-8 bg-primary/10 rounded-[var(--radius)] border border-primary/40 relative group cursor-pointer transition-all hover:scale-[1.02]">
                          <Badge className="absolute top-4 right-6 bg-primary text-primary-foreground font-black italic text-[8px] uppercase tracking-widest">Active Engine</Badge>
                          <div className="flex items-center gap-4 text-left">
                            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground"><Box size={32} /></div>
                            <div>
                              <h4 className="font-black uppercase italic text-lg text-foreground">HR Engine</h4>
                              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1 italic">Workforce & Identity Registry</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 bg-muted/30 rounded-[var(--radius)] border border-border relative group cursor-pointer transition-all hover:bg-muted/10 opacity-60 grayscale-[0.8] hover:grayscale-0">
                          <div className="flex items-center gap-4 text-left">
                            <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground"><Shield size={32} /></div>
                            <div>
                              <h4 className="font-black uppercase italic text-lg text-foreground">Legal Engine</h4>
                              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1 italic">Compliance & Risk Shield</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-4 border-border text-foreground font-black italic text-[8px] uppercase tracking-widest">Available Upgrade</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Settings */}
                  {activeTab === 'billing' && (
                    <div className="space-y-12">
                      <div className="p-10 bg-card rounded-[var(--radius)] border border-border relative overflow-hidden group shadow-3xl">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <CreditCard className="text-primary h-6 w-6" />
                              <h4 className="font-black uppercase italic text-xl text-foreground tracking-widest">Financial Gateway</h4>
                            </div>
                            <p className="max-w-md text-muted-foreground font-bold uppercase italic text-[11px] tracking-[0.2em] leading-relaxed">
                              Managed via <span className="text-foreground font-black">Polar.sh</span> edge marketplace.
                              Automated licensing and revenue distribution.
                            </p>
                            <div className="flex gap-4 pt-4">
                              <Badge className="bg-emerald-500 text-white font-black italic text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">Pro Enterprise Verified</Badge>
                            </div>
                          </div>
                          <Button className="h-16 px-10 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-transform active:scale-95 shadow-2xl">
                            Launch Dashboard
                            <ExternalLink size={16} className="ml-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">Infrastructure Ops</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-muted/30 rounded-3xl border border-border space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Database Engine</span>
                              <Badge className="bg-primary/20 text-primary border-primary/20 font-mono text-[9px]">CLOUDFLARE D1</Badge>
                            </div>
                            <Progress value={82} className="h-2 bg-muted/50 border border-border/10" indicatorClassName="bg-primary" />
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                              <span>Query Peak</span>
                              <span>82 / 100 Req/s</span>
                            </div>
                          </div>
                          <div className="p-6 bg-muted/30 rounded-3xl border border-border space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">Storage Provider</span>
                              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/20 font-mono text-[9px]">CLOUDFLARE R2</Badge>
                            </div>
                            <Progress value={45} className="h-2 bg-muted/50 border border-border/10" indicatorClassName="bg-orange-500" />
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                              <span>Object Capacity</span>
                              <span>4.2 GB / 10 GB</span>
                            </div>
                          </div>
                          Broadway
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Settings */}
                  {activeTab === 'navigation' && (
                    <div className="space-y-10 group">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black uppercase italic text-xs tracking-widest text-foreground">Global Menu Structure</h4>
                        <Button variant="ghost" className="h-10 text-[9px] font-black uppercase italic tracking-widest text-primary gap-2 hover:bg-primary/10 rounded-xl px-4 transition-all">
                          <Layout size={14} />
                          Synthesize New Link
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {(config.module?.nav || []).map((nav: any, idx: number) => (
                          <div key={idx} className="p-6 bg-muted/30 rounded-3xl border border-border flex items-center justify-between hover:border-primary/30 transition-all group/item shadow-sm">
                            <div className="flex items-center gap-6 flex-1">
                              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground cursor-move active:scale-110 transition-transform">
                                <Menu size={20} />
                              </div>
                              <div className="grid grid-cols-2 gap-6 flex-1 max-w-2xl px-4">
                                <div className="space-y-2">
                                  <Label className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic block">Link Identity</Label>
                                  <Input
                                    value={nav.title || ''}
                                    onChange={(e) => {
                                      const nextNav = [...(config.module?.nav || [])];
                                      nextNav[idx] = { ...nextNav[idx], title: e.target.value };
                                      handleUpdate('module.nav', nextNav);
                                    }}
                                    className="h-10 bg-transparent border-0 border-b border-border/30 rounded-none px-0 font-black italic text-xs uppercase tracking-widest text-foreground focus:ring-0 focus:border-primary"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic block">Target Path</Label>
                                  <Input
                                    value={nav.href || ''}
                                    onChange={(e) => {
                                      const nextNav = [...(config.module?.nav || [])];
                                      nextNav[idx] = { ...nextNav[idx], href: e.target.value };
                                      handleUpdate('module.nav', nextNav);
                                    }}
                                    className="h-10 bg-transparent border-0 border-b border-border/30 rounded-none px-0 font-mono text-xs text-primary focus:ring-0 focus:border-primary"
                                  />
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 transition-colors h-12 w-12 rounded-2xl hover:bg-red-500/5">
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        ))}
                        Broadway
                      </div>

                      <div className="p-10 border-2 border-dashed border-border rounded-[var(--radius)] text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer">
                        <AnimatePresence>
                          <motion.div
                            initial={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-muted/30 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-muted-foreground"
                          >
                            <span className="text-2xl font-black italic">+</span>
                          </motion.div>
                        </AnimatePresence>
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground/60">Append Registry Entry</p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted/30 p-10 flex flex-col items-center justify-center gap-4 text-center border-t border-border/50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase italic tracking-[0.25em] text-muted-foreground/60 px-10 leading-relaxed max-w-lg">
                    System-wide settings are immutable until committed. Synchronization occurs across the global edge CDN within 300ms of final save.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div >
  );
}

// Simple Progress component (since it might be missing from @shared)
function Progress({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) {
  return (
    <div className={`w-full h-4 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${indicatorClassName}`}
      />
    </div>
  );
}
