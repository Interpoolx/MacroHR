import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Globe,
  ShieldCheck,
  Database,
  CreditCard,
  Bell,
  Search,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Info,
  Layout,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Badge } from "@shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { siteConfig as initialConfig } from '@shared/config/site';
import { toast } from "sonner";

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
});

const CATEGORIES = [
  { id: 'general', label: 'General', icon: Settings, description: 'Core site identification and settings' },
  { id: 'branding', label: 'Branding', icon: Layout, description: 'Logo, colors, and visual identity' },
  { id: 'database', label: 'Backend & DB', icon: Database, description: 'API endpoints and storage providers' },
  { id: 'auth', label: 'Authentication', icon: ShieldCheck, description: 'Login providers and security protocols' },
  { id: 'billing', label: 'Finance', icon: CreditCard, description: 'Subscription plans and pricing' },
  { id: 'notifications', label: 'Communcations', icon: Bell, description: 'Email and push notification settings' },
  { id: 'deployment', label: 'Deployment', icon: Server, description: 'Live mode transition and cloud setup' },
];

function SettingsPage() {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.');
    const nextConfig = { ...config };
    let current: any = nextConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key === undefined) continue;
      if (!current[key]) current[key] = {};
      current[key] = { ...current[key] };
      current = current[key];
    }
    const finalKey = keys[keys.length - 1];
    if (finalKey !== undefined) {
      current[finalKey] = value;
    }
    setConfig({ ...nextConfig });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulating backend update
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    toast.success("Configuration Synced", {
      description: "System settings have been updated across the production cluster.",
      icon: "🚀"
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            System <span className="text-primary">Settings</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Live configuration engine for MacroHR</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="relative z-10 h-14 px-8 accent-gradient border-0 rounded-2xl font-black uppercase italic shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-3"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Commit Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation - Vertical Tabs */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="glass bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sticky top-8">
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left group ${activeTab === cat.id
                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeTab === cat.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                    <cat.icon size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-black uppercase italic text-xs tracking-widest">{cat.label}</p>
                    {activeTab === cat.id && (
                      <p className="text-[10px] font-bold opacity-70 truncate mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === cat.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="general" className="mt-0 space-y-6">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">General Configuration</CardTitle>
                      <CardDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-1">Foundational site identity metadata</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Application Name</Label>
                          <Input
                            value={config.name}
                            onChange={(e) => handleUpdate('name', e.target.value)}
                            className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Contact Email</Label>
                          <Input
                            value={config.contactEmail}
                            onChange={(e) => handleUpdate('contactEmail', e.target.value)}
                            className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Site Description</Label>
                          <textarea
                            value={config.description}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-primary/20 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Plus size={20} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase italic text-sm tracking-tighter">Dynamic Metadata</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-widest">Add custom key-value pairs to siteConfig</p>
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-bold text-slate-500 italic mb-4">Extend your configuration schema with custom variables.</p>
                      <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs uppercase italic tracking-widest">
                        Initialize Schema Entry
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="branding" className="mt-0 space-y-6">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Visual Identity</CardTitle>
                      <CardDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-1">Manage logos, favicons, and theme colors</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Primary Color (HEX)</Label>
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: config.theme.primaryColor }} />
                            <Input
                              value={config.theme.primaryColor}
                              onChange={(e) => handleUpdate('theme.primaryColor', e.target.value)}
                              className="h-12 bg-white/5 border-white/10 rounded-xl flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Secondary Color (HEX)</Label>
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: config.theme.secondaryColor }} />
                            <Input
                              value={config.theme.secondaryColor}
                              onChange={(e) => handleUpdate('theme.secondaryColor', e.target.value)}
                              className="h-12 bg-white/5 border-white/10 rounded-xl flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-black uppercase italic text-xs tracking-widest">Logo Configuration</span>
                          <Badge className="bg-primary/20 text-primary border-primary/20 italic font-black uppercase tracking-tighter text-[9px]">Production Asset</Badge>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-2 shadow-xl border-4 border-white/10">
                            <span className="text-slate-900 font-black text-2xl">{config.logo.icon}</span>
                          </div>
                          <div className="flex-1 space-y-3">
                            <Input
                              value={config.logo.text}
                              placeholder="Logo Text"
                              onChange={(e) => handleUpdate('logo.text', e.target.value)}
                              className="h-10 bg-white/5 border-white/10 rounded-xl"
                            />
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Asset path: {config.logo.url}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Other tabs follow same premium pattern... */}
                <TabsContent value="deployment" className="mt-0 space-y-6">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <CardHeader className="p-0 mb-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Infrastructure Deployment</CardTitle>
                          <CardDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-1">Transition system from Demo to Live environment</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                          <span className="text-[10px] font-black uppercase italic text-slate-400 px-2">System Mode</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={config.system_mode === 'demo' ? 'default' : 'ghost'}
                              onClick={() => handleUpdate('system_mode', 'demo')}
                              className={`h-8 rounded-xl text-[10px] font-black uppercase italic transition-all ${config.system_mode === 'demo' ? 'accent-gradient border-0 shadow-lg shadow-primary/20' : 'text-slate-500'}`}
                            >
                              Demo
                            </Button>
                            <Button
                              size="sm"
                              variant={config.system_mode === 'live' ? 'default' : 'ghost'}
                              onClick={() => handleUpdate('system_mode', 'live')}
                              className={`h-8 rounded-xl text-[10px] font-black uppercase italic transition-all ${config.system_mode === 'live' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}
                            >
                              Live
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                      {/* Setup Checker */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: 'Cloudflare D1', status: !!(config as any).cloudflare?.d1?.databaseId, desc: 'Primary SQL Engine' },
                          { name: 'Cloudflare R2', status: !!(config as any).cloudflare?.r2?.bucketName && !!(config as any).cloudflare?.r2?.accessKeyId, desc: 'Blob Storage' },
                          { name: 'Supabase Auth', status: !!(config as any).supabase?.url && !!(config as any).supabase?.anonKey, desc: 'Identity Provider' }
                        ].map((service, idx) => (
                          <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                            {service.status ? (
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                                <CheckCircle2 size={24} />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                <Zap size={24} />
                              </div>
                            )}
                            <h4 className="font-black uppercase italic text-sm tracking-tighter">{service.name}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-widest mt-1">{service.desc}</p>
                            <Badge className={`mt-4 ${service.status ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'} italic font-black uppercase text-[9px]`}>
                              {service.status ? 'Connected' : 'Missing Config'}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Credentials Table */}
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={16} className="text-primary" />
                          <h4 className="font-black uppercase italic text-xs tracking-widest">Environment Variables Required</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Cloudflare Account ID</Label>
                            <Input
                              value={(config as any).cloudflare?.r2?.accountId || ''}
                              onChange={(e) => handleUpdate('cloudflare.r2.accountId', e.target.value)}
                              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              className="h-12 bg-white/5 border-white/10 rounded-xl font-mono text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Supabase Project URL</Label>
                            <Input
                              value={(config as any).supabase?.url || ''}
                              onChange={(e) => handleUpdate('supabase.url', e.target.value)}
                              placeholder="https://xyz.supabase.co"
                              className="h-12 bg-white/5 border-white/10 rounded-xl font-mono text-xs"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-start gap-4">
                          <Info className="text-primary shrink-0" size={20} />
                          <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                            Ensuring these fields are populated correctly allows the system to pivot from
                            <span className="text-white"> JSON simulation</span> to
                            <span className="text-emerald-400"> Real Infrastructure</span>. Note that changing System Mode
                            to <span className="text-emerald-400">Live</span> without proper credentials will result in API failures.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="database" className="mt-0">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Database className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                      <h3 className="font-black uppercase italic tracking-tighter text-lg">Infrastructure Controls</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase italic tracking-widest mt-2">{config.system_mode === 'demo' ? 'Operating in Simulation Mode' : 'Connected to Cloudflare Worker'}</p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
