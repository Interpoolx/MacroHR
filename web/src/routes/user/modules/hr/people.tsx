import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../../../components/shared/DataTable'
import { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { UserPlus, Edit } from 'lucide-react'

interface Person {
    id: string
    name: string
    email: string
    department: string
    designation: string
    status: 'active' | 'inactive' | 'pending'
    joinDate: string
    avatar: string
}

export const Route = createFileRoute('/user/modules/hr/people')({
    component: PeopleManagementPage,
})

const tableConfig = {
    addLabel: "New Employee",
    editLabel: "Edit Employee",
    searchPlaceholder: "Search employees...", // optional – override default if needed
    // You can add more later:
    // deleteLabel: "Delete User",
    // emptyMessage: "No users found",
};

const columnHelper = createColumnHelper<Person>()

const columns: ColumnDef<Person, any>[] = [
    columnHelper.accessor('name', {
        header: 'Employee',
        cell: info => {
            const name = info.getValue()
            const email = info.row.original.email
            const avatar = info.row.original.avatar
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-black uppercase italic text-sm tracking-tight leading-none">{name}</span>
                        <span className="text-xs font-bold text-slate-500 mt-1">{email}</span>
                    </div>
                </div>
            )
        },
    }),
    columnHelper.accessor('department', {
        header: 'Dept',
        cell: info => <span className="text-xs font-black uppercase italic tracking-widest text-slate-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('designation', {
        header: 'Role',
        cell: info => <span className="text-[10px] font-bold text-slate-500 uppercase italic">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
            const status = info.getValue()
            const colors: Record<string, string> = {
                active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                inactive: "bg-red-500/10 text-red-500 border-red-500/20",
                pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
            }
            return (
                <Badge variant="outline" className={`font-black uppercase italic text-[9px] tracking-widest px-2 py-0 ${colors[status as keyof typeof colors]}`}>
                    {status}
                </Badge>
            )
        }
    }),
]

function PeopleManagementPage() {
    const [people, setPeople] = useState<Person[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPerson, setEditingPerson] = useState<Person | null>(null)
    const [formData, setFormData] = useState<Partial<Person>>({
        name: '',
        email: '',
        department: '',
        designation: '',
        status: 'active'
    })

    useEffect(() => {
        fetch('/data/hr/people.json')
            .then(res => res.json())
            .then(data => setPeople(data))
            .catch(err => console.error('Error fetching people:', err))
    }, [])

    const handleOpenModal = useCallback((person: Person | null = null) => {
        setEditingPerson(person)
        setFormData(person || {
            name: '',
            email: '',
            department: '',
            designation: '',
            status: 'active'
        })
        setIsModalOpen(true)
    }, [])

    const handleSave = useCallback(() => {
        if (!formData.name || !formData.email) {
            toast.error("Validation Error", { description: "Name and Email are required metrics." })
            return
        }

        if (editingPerson) {
            setPeople(prev => prev.map(p => p.id === editingPerson.id ? { ...p, ...formData } as Person : p))
            toast.success("Personnel Refined", { description: `${formData.name}'s registry has been synchronized.` })
        } else {
            const newPerson: Person = {
                ...formData,
                id: `EMP${Math.floor(Math.random() * 900) + 100}`,
                joinDate: new Date().toISOString().split('T')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
            } as Person
            setPeople(prev => [newPerson, ...prev])
            toast.success("Identity Synthesized", { description: `${formData.name} has been added to workforce.` })
        }
        setIsModalOpen(false)
    }, [formData, editingPerson])

    const handleDelete = useCallback((person: Person) => {
        setPeople(prev => prev.filter(p => p.id !== person.id))
        toast.info("Record Purged", {
            description: `${person.name} removed from active session registry.`
        })
    }, [])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        Workforce <span className="text-primary">Registry</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage employee identities and organizational depth</p>
                </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
                <DataTable
                    columns={columns}
                    data={people}
                    searchColumn="name"
                    config={tableConfig}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onAdd={() => handleOpenModal(null)}
                />
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="glass border-white/10 shadow-3xl rounded-[2.5rem] max-w-lg p-8 bg-black/90">
                    <DialogHeader className="mb-6">
                        <div className="w-14 h-14 accent-gradient rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                            {editingPerson ? <Edit className="text-white" size={28} /> : <UserPlus className="text-white" size={28} />}
                        </div>
                        <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-white">
                            {editingPerson ? 'Refine' : 'Add New'} <span className='text-primary'>Employee</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold uppercase italic text-[10px] tracking-widest mt-2">
                            {editingPerson ? 'Update existing employee record information' : 'Register a new employee into the workforce database'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Full Name</Label>
                            <Input
                                value={formData.name || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Email Address</Label>
                            <Input
                                value={formData.email || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Department</Label>
                                <Input
                                    value={formData.department || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Role</Label>
                                <Input
                                    value={formData.designation || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-10 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white">Abort</Button>
                        <Button onClick={handleSave} className="accent-gradient border-0 px-8">
                            {editingPerson ? 'Commit Updates' : 'Initialize Profile'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
