import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '../../components/shared/DataTable';
import { useState, useEffect } from 'react';
import { Badge } from "@shared/components/ui/badge";
import { toast } from "sonner";
import { Shield, Key, Users as UsersIcon, Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@shared/components/ui/dialog";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";

interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
}

export const Route = createFileRoute('/admin/roles')({
  component: RolesManagementPage,
});

const columnHelper = createColumnHelper<Role>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Role Name',
    cell: info => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Shield size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-black uppercase italic text-sm tracking-tight leading-none">{info.getValue()}</span>
          <span className="text-xs font-bold text-slate-500 mt-1 font-mono tracking-tighter">ID: {info.row.original.id}</span>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('key', {
    header: 'Key',
    cell: info => <Badge variant="secondary" className="font-mono text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10">{info.getValue()}</Badge>,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: info => <span className="text-sm font-bold text-slate-500 italic leading-tight max-w-[200px] block">{info.getValue()}</span>,
  }),
  columnHelper.accessor('permissions', {
    header: 'Permissions',
    cell: info => {
      const permissions = info.getValue();
      return (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {permissions.map(p => (
            <Badge key={p} variant="outline" className="text-[9px] font-black uppercase italic tracking-tighter bg-primary/5 border-primary/20 text-primary/70">
              {p}
            </Badge>
          ))}
        </div>
      )
    }
  }),
];

const AVAILABLE_PERMISSIONS = [
  'view_dashboard', 'manage_users', 'manage_roles', 'view_reports',
  'edit_settings', 'view_audit_log', 'system_restart', 'data_export'
];

function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    key: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    fetch('/json/roles.json')
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error('Error fetching roles:', err));
  }, []);

  const handleOpenModal = (role: Role | null = null) => {
    if (role && role.key === 'admin') {
      toast.error("Access Restriction", {
        description: "Root 'Admin' policy is cryptographically locked and immutable.",
        icon: <Key className="text-primary" />
      });
      return;
    }
    setEditingRole(role);
    setFormData(role || {
      name: '',
      key: '',
      description: '',
      permissions: []
    });
    setIsModalOpen(true);
  };

  const handleTogglePermission = (perm: string) => {
    const current = formData.permissions || [];
    if (current.includes(perm)) {
      setFormData({ ...formData, permissions: current.filter(p => p !== perm) });
    } else {
      setFormData({ ...formData, permissions: [...current, perm] });
    }
  };

  const handleSaveRole = () => {
    if (!formData.name || !formData.key) {
      toast.error("Policy Error", { description: "Name and Key are mandatory." });
      return;
    }

    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } as Role : r));
      toast.success("Policy Updated", { description: `${formData.name} security protocols refined.` });
    } else {
      const newRole: Role = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Role;
      setRoles([...roles, newRole]);
      toast.success("Policy Created", { description: `New security role ${formData.name} initialized.` });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (role: Role) => {
    if (role.key === 'admin') {
      toast.error("System Protocol Violation", {
        description: "Root 'Admin' role is immutable and cannot be purged.",
      });
      return;
    }
    setRoles(roles.filter(r => r.id !== role.id));
    toast.success("Policy Removed", {
      description: `Security role '${role.name}' has been deleted from the registry.`
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.5rem] accent-gradient flex items-center justify-center shadow-2xl shadow-primary/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              Roles & <span className="text-primary">Permissions</span>
            </h1>
            <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Define security protocols and access hierarchies</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black italic tracking-tighter leading-none">{roles.length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Active Profiles</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <UsersIcon size={20} />
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 glass rounded-[2.5rem] shadow-2xl">
        <DataTable
          columns={columns}
          data={roles}
          searchKey="name"
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onAdd={() => handleOpenModal(null)}
        />
      </div>

      {/* Role CRUD Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-white/10 shadow-3xl rounded-[2.5rem] max-w-2xl p-8">
          <DialogHeader className="mb-6">
            <div className="w-14 h-14 accent-gradient rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
              <Key className="text-white" size={28} />
            </div>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              {editingRole ? 'Refine' : 'Add New'} <span className="text-primary">Security Role</span>
            </DialogTitle>
            <DialogDescription className="font-bold text-slate-500 uppercase italic text-[10px] tracking-widest mt-2">
              {editingRole ? 'Update access control definitions' : 'Draft a new security policy for the ecosystem'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Role Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                  placeholder="Lead Architect"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Policy Key (Unique)</Label>
                <Input
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 font-mono"
                  placeholder="lead_architect"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-primary/20 focus:outline-none transition-all placeholder:text-slate-600"
                  placeholder="Describe the scope of this security role..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-black uppercase italic text-[10px] tracking-widest text-slate-400">Access Privileges</Label>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto custom-scrollbar">
                {AVAILABLE_PERMISSIONS.map(perm => {
                  const active = formData.permissions?.includes(perm);
                  return (
                    <button
                      key={perm}
                      onClick={() => handleTogglePermission(perm)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active
                          ? 'bg-primary/20 border-primary text-white'
                          : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                        }`}
                    >
                      <span className="text-[10px] font-black uppercase italic tracking-widest">{perm.replace(/_/g, ' ')}</span>
                      {active ? <Shield size={14} className="text-primary fill-current" /> : <Eye size={14} />}
                    </button>
                  );
                })}
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
              onClick={handleSaveRole}
              className="h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs tracking-widest"
            >
              {editingRole ? 'Commit Updates' : 'Initialize Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
