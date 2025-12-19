import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  LifeBuoy,
  ChevronRight,
  Save,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Tabs, TabsContent } from "@shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute('/user/settings')({
  component: HRSettingsPage,
});

const HR_CATEGORIES = [
  { id: 'payroll', label: 'Payroll Cycles', icon: DollarSign, description: 'Payment frequencies and tax groups' },
  { id: 'leave', label: 'Leave Policies', icon: Calendar, description: 'Accrual rules and holiday calendars' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, description: 'Review templates and rating scales' },
  { id: 'benefits', label: 'Benefits & Perks', icon: Heart, description: 'Medical, retirement, and wellness' },
  { id: 'attendance', label: 'Work Schedules', icon: Clock, description: 'Shift patterns and clock-in rules' },
  { id: 'support', label: 'Support Config', icon: LifeBuoy, description: 'Internal helpdesk and FAQs' },
];

function HRSettingsPage() {
  const [activeTab, setActiveTab] = useState('payroll');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    toast.success("HR Configuration Updated", {
      description: "Personnel policies have been synchronized with the employee portal.",
      icon: "📋"
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            HR <span className="text-primary">Policy Engine</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage organizational rules and employee experience</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="relative z-10 h-14 px-8 accent-gradient border-0 rounded-2xl font-black uppercase italic shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-3 text-white"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Update Policies
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation - Vertical Tabs */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="glass bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sticky top-8">
            <div className="space-y-2">
              {HR_CATEGORIES.map((cat) => (
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
                <TabsContent value="payroll" className="mt-0 space-y-6">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Payroll Cycles</CardTitle>
                      <CardDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-1">Configure automated disbursement schedules</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Payment Frequency</Label>
                          <select className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                            <option>Monthly (Standard)</option>
                            <option>Bi-Weekly</option>
                            <option>Weekly</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Disbursement Day</Label>
                          <Input type="number" defaultValue="28" className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leave" className="mt-0 space-y-6">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-2xl font-black uppercase italic tracking-tighter">Annual Leave Policy</CardTitle>
                      <CardDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-1">Time-off allocation and accrual settings</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={24} />
                            </div>
                            <div>
                              <h4 className="font-black uppercase italic text-sm tracking-tighter">Accrual Enabled</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase italic tracking-widest">Employees earn leave time monthly</p>
                            </div>
                          </div>
                          <div className="w-12 h-6 rounded-full bg-primary relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Standard Allowance (Days)</Label>
                            <Input type="number" defaultValue="25" className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Max Roll-over Carry</Label>
                            <Input type="number" defaultValue="5" className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance" className="mt-0">
                  <Card className="glass border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                      <h3 className="font-black uppercase italic tracking-tighter text-lg">Workforce Scheduling</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase italic tracking-widest mt-2">Loading shift pattern generator...</p>
                    </div>
                  </Card>
                </TabsContent>

                {/* Other HR settings tabs would follow similar structure */}
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
