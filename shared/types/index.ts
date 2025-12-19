export interface KPIMetric {
  title: string;
  value: string;
  growth: number;
  data: { value: number }[];
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
}

export interface Document {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Payslip {
  id: string;
  memberId: string;
  period: string;
  amount: number;
  generatedDate: string;
  status: 'paid' | 'pending';
}

export interface SupportTicket {
  id: string;
  memberId: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed' | 'in-progress';
  createdAt: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed';
  createdAt: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  company: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface BenefitPlan {
  id: string;
  name: string;
  type: string;
  employeeCost: number;
  employerCost: number;
  totalCost: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  logo: string;
  totalMembers: number;
  dueDate: string;
  progress: number;
}

export interface SpendingData {
  month: string;
  salary: number;
  taxes: number;
}

export interface NavItem {
  label: string;
  icon: any; // React.ComponentType
  active?: boolean;
}
