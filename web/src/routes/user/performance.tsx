import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@shared/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@shared/components/ui/button"
import { TrendingUp, Plus, Star } from 'lucide-react'

interface PerformanceReview {
  id: string
  employeeName: string
  reviewPeriod: string
  rating: number
  status: 'completed' | 'pending' | 'in-progress'
  feedback: string
}

export const Route = createFileRoute('/user/performance')({
  component: PerformanceManagementPage,
})

const columnHelper = createColumnHelper<PerformanceReview>()

const columns: ColumnDef<PerformanceReview, any>[] = [
  columnHelper.accessor('employeeName', {
    header: 'Employee',
    cell: info => <span className="font-black uppercase italic text-sm tracking-tight">{info.getValue()}</span>,
  }),
  columnHelper.accessor('reviewPeriod', {
    header: 'Period',
    cell: info => <span className="text-xs font-bold text-slate-400 font-mono italic">{info.getValue()}</span>,
  }),
  columnHelper.accessor('rating', {
    header: 'Rating',
    cell: info => (
      <div className="flex items-center gap-1.5">
        <Star size={12} className="text-primary fill-primary" />
        <span className="font-black italic text-white">{info.getValue()}</span>
      </div>
    )
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue()
      const colors = {
        completed: "bg-emerald-500/10 text-emerald-500",
        pending: "bg-orange-500/10 text-orange-500",
        'in-progress': "bg-blue-500/10 text-blue-500",
      }
      return (
        <Badge variant="outline" className={`font-black uppercase italic text-[9px] tracking-widest px-2 ${colors[status as keyof typeof colors]}`}>
          {status}
        </Badge>
      )
    }
  })
]

function PerformanceManagementPage() {
  const [data, setData] = useState<PerformanceReview[]>([])

  useEffect(() => {
    fetch('/data/performance.json')
      .then(res => res.json())
      .then(d => setData(d))
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Growth <span className="text-primary">Metrix</span>
            </h1>
            <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Monitor review cycles and employee performance trajectory</p>
          </div>
        </div>
        <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" />
          Launch Review cycle
        </Button>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
        <DataTable
          columns={columns}
          data={data}
          searchKey="employeeName"
          onDelete={(row) => {
            setData(data.filter(d => d.id !== row.id))
            toast.info("Review Record Purged")
          }}
        />
      </div>
    </div>
  )
}
