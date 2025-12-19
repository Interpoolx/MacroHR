import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@shared/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@shared/components/ui/button"
import { Heart, Plus } from 'lucide-react'

interface Benefit {
    id: string
    name: string
    provider: string
    category: string
    coverage: string
    monthlyCost: number
    status: 'active' | 'inactive'
}

export const Route = createFileRoute('/user/benefits')({
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

    useEffect(() => {
        fetch('/data/benefits.json')
            .then(res => res.json())
            .then(d => setData(d))
    }, [])

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
                <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] tracking-widest">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Plan
                </Button>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="name"
                    onDelete={(row) => {
                        setData(data.filter(d => d.id !== row.id))
                        toast.info("Benefit Plan Deactivated")
                    }}
                />
            </div>
        </div>
    )
}
