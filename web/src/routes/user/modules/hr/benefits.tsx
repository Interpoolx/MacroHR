import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Plus, Edit } from 'lucide-react'

interface Benefit {
    id: string
    name: string
    provider: string
    category: string
    coverage: string
    monthlyCost: number
    status: 'active' | 'inactive'
}

export const Route = createFileRoute('/user/modules/hr/benefits')({
    component: BenefitsManagementPage,
})

const columnHelper = createColumnHelper<Benefit>()

const columns: ColumnDef<Benefit, any>[] = [
    columnHelper.accessor('name', {
        header: 'Plan Name',
        cell: info => <span className="font-black uppercase italic text-sm tracking-tight">{info.getValue()}</span>,
    }),
    columnHelper.accessor('provider', {
        header: 'Provider',
        cell: info => <span className="text-xs font-bold text-slate-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
        header: 'Category',
        cell: info => <span className="text-[10px] font-black uppercase italic tracking-widest text-primary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('monthlyCost', {
        header: 'Cost/mo',
        cell: info => <span className="font-mono text-white">${info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
            <Badge variant="outline" className={`font-black uppercase italic text-[9px] tracking-widest px-2 ${info.getValue() === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {info.getValue()}
            </Badge>
        )
    })
]

function BenefitsManagementPage() {
    const [data, setData] = useState<Benefit[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null)
    const [formData, setFormData] = useState<Partial<Benefit>>({
        name: '',
        provider: '',
        category: '',
        monthlyCost: 0,
        status: 'active'
    })

    useEffect(() => {
        fetch('/data/benefits.json')
            .then(res => res.json())
            .then(d => setData(d))
    }, [])

    const handleOpenModal = (benefit: Benefit | null = null) => {
        console.log("DEBUG: handleOpenModal benefits.tsx", benefit);
        setEditingBenefit(benefit)
        setFormData(benefit || {
            name: '',
            provider: '',
            category: '',
            monthlyCost: 0,
            status: 'active'
        })
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (editingBenefit) {
            setData(prev => prev.map(b => b.id === editingBenefit.id ? { ...b, ...formData } as Benefit : b))
            toast.success("Plan Updated")
        } else {
            const newBenefit: Benefit = {
                ...formData,
                id: Math.random().toString(36).substr(2, 9),
            } as Benefit
            setData(prev => [newBenefit, ...prev])
            toast.success("Plan Created")
        }
        setIsModalOpen(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
                        <Heart size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Perks & <span className="text-primary">Benefits</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage employee healthcare and wellness packages</p>
                    </div>
                </div>
                <Button
                    onClick={() => handleOpenModal(null)}
                    className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] tracking-widest"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Plan
                </Button>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="name"
                    onEdit={handleOpenModal}
                    onDelete={(row) => {
                        setData(data.filter(d => d.id !== row.id))
                        toast.info("Benefit Plan Deactivated")
                    }}
                    onAdd={() => handleOpenModal(null)}
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass border-white/10 shadow-3xl rounded-[2.5rem] max-w-lg p-8 bg-black/90">
                    <DialogHeader className="mb-6">
                        <div className="w-14 h-14 accent-gradient rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                            {editingBenefit ? <Edit className="text-white" size={28} /> : <Plus className="text-white" size={28} />}
                        </div>
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-white">
                            {editingBenefit ? 'Refine' : 'Add New'} <span className='text-primary'>Benefit Plan</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold uppercase italic text-[10px] tracking-widest mt-2">
                            {editingBenefit ? 'Adjust existing coverage and premium parameters' : 'Onboard a new employee wellness package into the ecosystem'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Plan Name</Label>
                            <Input
                                value={formData.name || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                placeholder="Premium Health Gold"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Provider</Label>
                                <Input
                                    value={formData.provider || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Monthly Cost</Label>
                                <Input
                                    type="number"
                                    value={formData.monthlyCost || 0}
                                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyCost: parseFloat(e.target.value) }))}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-10 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/10">Abort</Button>
                        <Button onClick={handleSave} className="accent-gradient border-0 px-8 text-white">
                            {editingBenefit ? 'Update Protocol' : 'Initialize Package'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
