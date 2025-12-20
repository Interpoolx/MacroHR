import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { Badge } from "@shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@shared/components/ui/dialog"
import { Button } from "@shared/components/ui/button"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import { User, ShieldCheck, Mail, MapPin, Phone, Building2 } from 'lucide-react'

interface EmployeeProfile {
    id: string
    name: string
    email: string
    phone: string
    address: string
    department: string
    designation: string
    joiningDate: string
    avatar: string
}

export const Route = createFileRoute('/user/modules/hr/personal')({
    component: PersonnelDossierPage,
})

const columnHelper = createColumnHelper<EmployeeProfile>()

const columns: ColumnDef<EmployeeProfile, any>[] = [
    columnHelper.accessor('name', {
        header: 'Entity Identifer',
        cell: info => {
            const name = info.getValue()
            const avatar = info.row.original.avatar
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-black uppercase italic text-sm tracking-tight leading-none text-white">{name}</span>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{info.row.original.id}</span>
                    </div>
                </div>
            )
        },
    }),
    columnHelper.accessor('email', {
        header: 'Corporate Email',
        cell: info => <span className="text-xs font-bold text-slate-400 font-mono italic">{info.getValue()}</span>,
    }),
    columnHelper.accessor('department', {
        header: 'Department',
        cell: info => <Badge variant="secondary" className="bg-white/5 border-white/10 text-[9px] font-black uppercase italic tracking-widest">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('phone', {
        header: 'Contact Trace',
        cell: info => <span className="text-xs font-bold text-slate-500">{info.getValue()}</span>,
    }),
]

function PersonnelDossierPage() {
    const [profiles, setProfiles] = useState<EmployeeProfile[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [viewingProfile, setViewingProfile] = useState<EmployeeProfile | null>(null)

    useEffect(() => {
        // Using existing data for demo
        fetch('/data/hr/people.json')
            .then(res => res.json())
            .then(data => {
                // Map person to profile for detailed view simulation
                const profiles = data.map((p: any) => ({
                    ...p,
                    phone: '+1 (555) 0123',
                    address: '88 Tech Highstreet, Silicon Plain',
                    joiningDate: p.joinDate || '2023-01-15'
                }))
                setProfiles(profiles)
            })
    }, [])

    const handleSelectProfile = (profile: EmployeeProfile) => {
        setViewingProfile(profile)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Personnel <span className="text-primary">Dossiers</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">High-depth verified employee identities and contact records</p>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={profiles}
                    searchColumn="name"
                    onEdit={handleSelectProfile} // Re-using Edit for Detailed Viewer
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass border-white/10 shadow-3xl rounded-[2.5rem] max-w-2xl p-0 overflow-hidden bg-black/95">
                    {viewingProfile && (
                        <div className="flex flex-col">
                            <div className="h-32 bg-primary/20 relative">
                                <div className="absolute -bottom-12 left-8 p-1.5 bg-black rounded-[2rem] border-4 border-white/5">
                                    <Avatar className="h-32 w-32 rounded-[1.8rem]">
                                        <AvatarImage src={viewingProfile.avatar} />
                                        <AvatarFallback className="text-2xl font-black">{viewingProfile.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>

                            <div className="pt-16 pb-12 px-12 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                                            {viewingProfile.name}
                                        </h2>
                                        <div className="flex gap-4 mt-3">
                                            <Badge variant="outline" className="text-primary border-primary/20 font-black italic uppercase text-[10px] tracking-widest px-3">
                                                {viewingProfile.designation}
                                            </Badge>
                                            <span className="text-slate-500 font-bold uppercase italic text-[10px] tracking-widest flex items-center gap-1.5">
                                                <ShieldCheck size={12} className="text-emerald-500" />
                                                ID: {viewingProfile.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase italic tracking-[0.2em] text-slate-500">Joined workforce</p>
                                        <p className="text-white font-black italic uppercase tracking-tight mt-1">{viewingProfile.joiningDate}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Mail size={18} /></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Corporate Email</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{viewingProfile.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Phone size={18} /></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Contact Number</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{viewingProfile.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Building2 size={18} /></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Assigned Module</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{viewingProfile.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><MapPin size={18} /></div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Base Location</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{viewingProfile.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white h-12 px-8 uppercase font-black italic tracking-widest">
                                        Close Artifact
                                    </Button>
                                    <Button className="accent-gradient border-0 h-12 px-8 rounded-xl font-black uppercase italic shadow-lg shadow-primary/20">
                                        Generate Full Report
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
