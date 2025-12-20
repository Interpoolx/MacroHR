import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { useState, useEffect } from 'react'
import { Badge } from "@shared/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@shared/components/ui/button"
import { Files, FileDown, UploadCloud } from 'lucide-react'

interface Document {
    id: string
    name: string
    type: string
    category: string
    uploadDate: string
    owner: string
}

export const Route = createFileRoute('/user/modules/hr/documents')({
    component: DocumentsPage,
})

const columnHelper = createColumnHelper<Document>()

const columns: ColumnDef<Document, any>[] = [
    columnHelper.accessor('name', {
        header: 'Document Name',
        cell: info => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                    <span className="text-[9px] font-black uppercase">{info.row.original.type}</span>
                </div>
                <span className="font-black uppercase italic text-sm tracking-tight">{info.getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('owner', {
        header: 'Personnel',
        cell: info => <span className="text-xs font-bold text-slate-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
        header: 'Category',
        cell: info => <span className="text-[10px] font-black uppercase italic tracking-widest text-primary">{info.getValue()}</span>,
    }),
    columnHelper.accessor('uploadDate', {
        header: 'Date Uploaded',
        cell: info => <span className="font-mono text-slate-500 text-xs">{info.getValue()}</span>,
    }),
    columnHelper.display({
        id: 'download',
        cell: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-white/10">
                <FileDown size={14} />
            </Button>
        )
    })
]

function DocumentsPage() {
    const [data, setData] = useState<Document[]>([])

    useEffect(() => {
        fetch('/data/hr/documents.json')
            .then(res => res.json())
            .then(d => setData(d))
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
                        <Files size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Artifact <span className="text-primary">Library</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Secure centralized repository for organizational documents</p>
                    </div>
                </div>
                <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload Entity
                </Button>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="name"
                    onDelete={(row) => {
                        setData(data.filter(d => d.id !== row.id))
                        toast.info("Document Purged from Archive")
                    }}
                />
            </div>
        </div>
    )
}
