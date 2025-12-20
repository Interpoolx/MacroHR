import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ScrollText, Plus } from 'lucide-react'

interface JobReference {
    id: string
    employeeName: string
    requestDate: string
    type: string
    recipient: string
    status: 'approved' | 'pending' | 'rejected'
}

export const Route = createFileRoute('/user/modules/hr/job-reference')({
    component: JobReferencePage,
})

const columnHelper = createColumnHelper<JobReference>()

const columns = [
    columnHelper.accessor('employeeName', {
        header: 'Subject',
        cell: info => <span className="font-black uppercase italic text-sm tracking-tight text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('recipient', {
        header: 'Recipient',
        cell: info => <span className="text-xs font-bold text-slate-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', {
        header: 'Doc Type',
        cell: info => <span className="text-[10px] font-black uppercase italic tracking-widest text-primary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue()
            const colors = {
                approved: "bg-emerald-500/10 text-emerald-500",
                pending: "bg-orange-500/10 text-orange-500",
                rejected: "bg-red-500/10 text-red-500",
            }
            return (
                <Badge variant="outline" className={"font-black uppercase italic text-[9px] tracking-widest px-2 ${colors[status]}"}>
                    {status}
                </Badge>
            )
        }
    })
]

function JobReferencePage() {
    const [data, setData] = useState<JobReference[]>([])

    useEffect(() => {
        fetch('/data/hr/job_references.json')
            .then(res => res.json())
            .then(d => setData(d))
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
                        <ScrollText size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Reference <span className="text-primary">Vault</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Process employment verifications and reference letters</p>
                    </div>
                </div>
                <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest">
                    <Plus className="w-4 h-4 mr-2" />
                    Issue Reference
                </Button>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="employeeName"
                    onDelete={(row) => {
                        setData(data.filter(d => d.id !== row.id))
                        toast.info("Reference Request Expunged")
                    }}
                />
            </div>
        </div>
    )
}
