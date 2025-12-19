import {
  Layout,
  Users,
  Receipt,
  Clock,
  Gift,
  User,
  Briefcase,
  FileText,
  ChartPie,
} from '@phosphor-icons/react';

export interface MenuItem {
  label: string;
  id: string;
  href: string;
  icon: typeof Layout;
  description: string;
  badge?: string;
  children?: MenuItem[];
}

export const ADMIN_MENU_CONFIG = [
  {
    label: 'Dashboard',
    id: 'dashboard',
    href: '/dashboard',
    icon: Layout,
    description: 'Overview and analytics',
  },
  {
    label: 'People',
    id: 'people',
    href: '/people',
    icon: Users,
    description: 'Manage employees',
    children: [
      {
        label: 'All Employees',
        id: 'employees',
        href: '/people/employees',
        icon: Users,
        description: 'View all employees',
      },
      {
        label: 'Departments',
        id: 'departments',
        href: '/people/departments',
        icon: Briefcase,
        description: 'Manage departments',
      },
    ],
  },
  {
    label: 'Payslip',
    id: 'payslip',
    href: '/payslip',
    icon: Receipt,
    description: 'Payroll management',
    badge: 'Beta',
  },
  {
    label: 'Attendance',
    id: 'attendance',
    href: '/attendance',
    icon: Clock,
    description: 'Attendance & time tracking',
  },
  {
    label: 'Benefits',
    id: 'benefits',
    href: '/benefits',
    icon: Gift,
    description: 'Employee benefits',
  },
  {
    label: 'Performance',
    id: 'performance',
    href: '/performance',
    icon: ChartPie,
    description: 'Performance reviews',
  },
  {
    label: 'Personal details',
    id: 'personal',
    href: '/personal',
    icon: User,
    description: 'Employee information',
  },
  {
    label: 'Job & Reference',
    id: 'job',
    href: '/job-reference',
    icon: Briefcase,
    description: 'Job details & references',
  },
  {
    label: 'Documents',
    id: 'documents',
    href: '/documents',
    icon: FileText,
    description: 'Document management',
  },
] as const satisfies readonly MenuItem[];

export const SECONDARY_MENU = [
  {
    label: 'Settings',
    id: 'settings',
    href: '/settings',
    description: 'System settings',
  },
  {
    label: 'Support',
    id: 'support',
    href: '/support',
    description: 'Help & support',
  },
] as const;
