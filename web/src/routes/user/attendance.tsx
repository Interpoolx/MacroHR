import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../components/shared/DataTable'
import { Badge } from "@shared/components/ui/badge"
import { Calendar, Clock, Download, Filter, Users } from 'lucide-react'
import { Button } from "@shared/components/ui/button"
import { z } from 'zod'

const searchSchema = z.object({
  role: z.enum(['user', 'manager']).optional().catch('user'),
})

export const Route = createFileRoute('/user/attendance')({
  validateSearch: searchSchema,
  component: AttendancePage,
})

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  clockIn: string
  clockOut: string
  status: 'on-time' | 'late' | 'absent' | 'half-day'
  hoursWork: number
}

const columnHelper = createColumnHelper<AttendanceRecord>()

function AttendancePage() {
  const [data, setData] = useState<AttendanceRecord[]>([])
  const { role } = Route.useSearch()
  const isManager = role === 'manager'

  useEffect(() => {
    fetch('/data/attendance.json')
      .then(res => res.json())
      .then(allData => {
        if (isManager) {
          setData(allData)
        } else {
          setData(allData.filter((r: any) => r.employeeId === 'EMP001'))
        }
      })
  }, [isManager])

  const columns: ColumnDef<AttendanceRecord, any>[] = [
    ...(isManager ? [
      columnHelper.accessor('employeeName', {
        header: 'Employee',
        cell: info => <span className="font-black uppercase italic text-xs text-white">{info.getValue()}</span>,
      })
    ] : []),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => <span className="font-bold italic text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('clockIn', {
      header: 'In',
      cell: info => <span className="font-mono text-emerald-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('clockOut', {
      header: 'Out',
      cell: info => <span className="font-mono text-orange-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue()
        const colors = {
          'on-time': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          'late': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          'absent': 'bg-red-500/10 text-red-500 border-red-500/20',
          'half-day': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        }
        return (
          <Badge variant="outline" className={`font-black uppercase italic text-[9px] tracking-widest px-2 py-0.5 ${colors[status as keyof typeof colors]}`}>
            {status}
          </Badge>
        )
      }
    }),
    columnHelper.accessor('hoursWork', {
      header: 'Hours',
      cell: info => <span className="font-black italic text-white">{info.getValue()}h</span>,
    }),
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
            {isManager ? <Users size={32} /> : <Calendar size={32} />}
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              {isManager ? 'Team' : 'Personal'} <span className="text-primary">Attendance</span>
            </h1>
            <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">
              {isManager ? 'Overview of workforce discipline and shift adherence' : 'Track your discipline and work hours history'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-white/5 font-black uppercase italic text-[10px] tracking-widest hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          {!isManager && (
            <Button className="h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] tracking-widest">
              Clock In Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-500 mb-1">{isManager ? 'Team Late Count' : 'Avg. Clock In'}</p>
          <h3 className={`text-3xl font-black italic tracking-tighter ${isManager ? 'text-orange-400' : 'text-emerald-400'}`}>
            {isManager ? '08' : '08:52 AM'}
          </h3>
        </div>
        <div className="glass bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-500 mb-1">{isManager ? 'Active Shifts' : 'Total Late Days'}</p>
          <h3 className="text-3xl font-black italic tracking-tighter text-sky-400">
            {isManager ? '124' : '02'} <span className="text-xs uppercase ml-1">Live</span>
          </h3>
        </div>
        <div className="glass bg-white/5 border border-white/10 rounded-3xl p-6">
          <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-500 mb-1">Discipline Index</p>
          <h3 className="text-3xl font-black italic tracking-tighter text-primary">98.5%</h3>
        </div>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
        <DataTable
          columns={columns}
          data={data}
          searchKey={isManager ? "employeeName" : "date"}
        />
      </div>
    </div>
  )
}
