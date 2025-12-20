import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Download, Plus } from 'lucide-react'

interface Payslip {
    id: string
    employeeName: string
    month: string
    year: number
    netSalary: number
    status: 'paid' | 'processed' | 'pending'
}

export const Route = createFileRoute('/user/modules/hr/payslip')({
    component: PayslipManagementPage,
})

const columnHelper = createColumnHelper<Payslip>()

const columns: ColumnDef<Payslip, any>[] = [
    columnHelper.accessor('employeeName', {
        header: 'Employee',
        cell: info => <span className="font-black uppercase italic text-sm tracking-tight text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor('month', {
        header: 'Period',
        cell: info => <span className="text-xs font-bold text-slate-400">{info.getValue()} {info.row.original.year}</span>,
    }),
    columnHelper.accessor('netSalary', {
        header: 'Amount',
        cell: info => <span className="font-mono text-emerald-400 font-bold">${info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue()
            const colors = {
                paid: "bg-emerald-500/10 text-emerald-500",
                processed: "bg-blue-500/10 text-blue-500",
                pending: "bg-orange-500/10 text-orange-500",
            }
            return (
                <Badge variant="outline" className={"font-black uppercase italic text-[9px] tracking-widest px-2 ${colors[status as keyof typeof colors]}"}>
                    {status}
                </Badge>
            )
        }
    }),
]

function PayslipManagementPage() {
    const [data, setData] = useState<Payslip[]>([])

    useEffect(() => {
        fetch('/data/hr/payslips.json')
            .then(res => res.json())
            .then(d => setData(d))
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        Payroll <span className="text-primary">Archive</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage disbursement history and generate slips</p>
                </div>
                <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] tracking-widest">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Batch
                </Button>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="employeeName"
                    onDelete={(row) => {
                        setData(data.filter(d => d.id !== row.id))
                        toast.info("Payslip Voided")
                    }}
                />
            </div>
        </div>
    )
}
