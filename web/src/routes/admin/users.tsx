import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/shared/DataTable';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from "@shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@shared/components/ui/dialog";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@shared/components/ui/select";
import { UserPlus, Edit2, ShieldAlert } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export const Route = createFileRoute('/admin/users')({
  component: UsersManagementPage,
});

const columnHelper = createColumnHelper<User>();

const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('name', {
    header: 'User',
    cell: info => {
      const name = info.getValue();
      const email = info.row.original.email;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
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
  columnHelper.accessor('role', {
    header: 'Role',
    cell: info => {
      const role = info.getValue();
      const colors: Record<string, string> = {
        admin: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        user: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      };
      return (
        <Badge variant="outline" className={`font-black uppercase italic text-[10px] tracking-widest px-2 py-0 ${colors[role] || colors.user}`}>
          {role}
        </Badge>
      )
    }
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      const colors: Record<string, string> = {
        active: "bg-emerald-500",
        inactive: "bg-red-500",
        pending: "bg-orange-500",
      };
      return (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colors[status]} shadow-[0_0_8px_currentColor]`} />
          <span className="text-xs font-black uppercase italic tracking-widest text-slate-400">{status}</span>
        </div>
      )
    }
  }),
  columnHelper.accessor('createdAt', {
    header: 'Joined',
    cell: info => <span className="text-xs font-bold text-slate-600 font-mono italic">{new Date(info.getValue()).toLocaleDateString()}</span>,
  }),
];

function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetch('/data/users.json')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleOpenModal = useCallback((user: User | null = null) => {
    if (user && user.role === 'admin') {
      toast.error("Operation Restricted", {
        description: "Root Admin accounts cannot be Modified for security reasons.",
        icon: <ShieldAlert className="text-red-500" />
      });
      return;
    }
    setEditingUser(user);
    setFormData(user || {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    });
    setTimeout(() => setIsModalOpen(true), 10);
  }, []);

  const handleSaveUser = useCallback(() => {
    if (!formData.name || !formData.email) {
      toast.error("Validation Error", { description: "Name and Email are required." });
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
      toast.success("User Refined", { description: `${formData.name}'s registry has been updated.` });
    } else {
      const newUser: User = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      } as User;
      setUsers(prev => [newUser, ...prev]);
      toast.success("Identity Created", { description: `${formData.name} has been added to the system.` });
    }
    setIsModalOpen(false);
  }, [formData, editingUser]);

  const handleDelete = useCallback((user: User) => {
    if (user.role === 'admin') {
      toast.error("Operation Denied", {
        description: "Root Admin accounts are protected from deletion.",
      });
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast.success("User Removed", {
      description: `${user.name} has been deleted from the registry (Session only).`
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            User <span className="text-primary">Management</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage system access and roles across the ecosystem</p>
        </div>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onAdd={() => handleOpenModal(null)}
        />
      </div>

      {/* CRUD Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 shadow-3xl rounded-[2.5rem] max-w-lg p-8">
          <DialogHeader className="mb-6">
            <div className="w-14 h-14 accent-gradient rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
              {editingUser ? <Edit2 className="text-white" size={28} /> : <UserPlus className="text-white" size={28} />}
            </div>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              {editingUser ? 'Refine' : 'Add New'} <span className="text-primary">User</span>
            </DialogTitle>
            <DialogDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-2">
              {editingUser ? 'Synthesize updates for existing identity' : 'Initialize a new security profile in the system'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Full Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Email Address</Label>
              <Input
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">System Role</Label>
                <Select
                  value={(formData.role || 'user') as string}
                  onValueChange={(v: string) => setFormData(prev => ({ ...prev, role: v as any }))}
                >
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-2xl p-2">
                    <SelectItem value="user" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">User</SelectItem>
                    <SelectItem value="manager" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">Manager</SelectItem>
                    <SelectItem value="admin" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Registry Status</Label>
                <Select
                  value={(formData.status || 'active') as string}
                  onValueChange={(v: string) => setFormData(prev => ({ ...prev, status: v as any }))}
                >
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-2xl p-2">
                    <SelectItem value="active" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">Active</SelectItem>
                    <SelectItem value="inactive" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">Inactive</SelectItem>
                    <SelectItem value="pending" className="rounded-xl focus:bg-white/10 font-bold text-xs uppercase italic tracking-widest">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10 flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="h-12 px-6 rounded-xl font-black uppercase italic text-xs tracking-widest text-slate-400 hover:text-white hover:bg-white/5"
            >
              Abort
            </Button>
            <Button
              onClick={handleSaveUser}
              className="h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs tracking-widest"
            >
              {editingUser ? 'Commit Updates' : 'Initialize Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
