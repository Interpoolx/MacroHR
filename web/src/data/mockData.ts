import { KPIMetric, Project, SpendingData } from '../types';

// Generate random values between 15 and 70
const generateRandomData = (count: number) => {
  return Array.from({ length: count }, () => ({
    value: Math.floor(Math.random() * (70 - 15 + 1)) + 15,
  }));
};

export const kpiMetrics: KPIMetric[] = [
  {
    title: 'Total received',
    value: '307.48k',
    growth: 30,
    color: '#6D4AFE',
    data: generateRandomData(21),
  },
  {
    title: 'Total given',
    value: '278.59k',
    growth: 24,
    color: '#22C55E',
    data: generateRandomData(21),
  },
  {
    title: 'Total requested',
    value: '508.48k',
    growth: 18,
    color: '#F59E0B',
    data: generateRandomData(21),
  },
  {
    title: 'Total pending',
    value: '307.48k',
    growth: 12,
    color: '#A78BFA',
    data: generateRandomData(21),
  },
];

export const spendingData: SpendingData[] = [
  { month: 'Jan', salary: 62000, taxes: 24000 },
  { month: 'Feb', salary: 70000, taxes: 30000 },
  { month: 'Mar', salary: 55000, taxes: 28000 },
  { month: 'Apr', salary: 48000, taxes: 22000 },
  { month: 'May', salary: 65000, taxes: 26000 },
  { month: 'Jun', salary: 80000, taxes: 35000 },
  { month: 'Jul', salary: 85000, taxes: 38000 },
  { month: 'Aug', salary: 92000, taxes: 40000 },
  { month: 'Sep', salary: 68000, taxes: 30000 },
  { month: 'Oct', salary: 50000, taxes: 20000 },
  { month: 'Nov', salary: 75000, taxes: 32000 },
  { month: 'Dec', salary: 60000, taxes: 25000 },
];

export const projects: Project[] = [
  {
    id: '1',
    name: 'Apple',
    description: 'website redesign',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    totalMembers: 12,
    dueDate: '04 Jan 2024',
    progress: 50,
  },
  {
    id: '2',
    name: 'MagicHR Payroll',
    description: 'Web app',
    logo: '/logo.png',
    totalMembers: 8,
    dueDate: '06 Jan 2024',
    progress: 70,
  },
  {
    id: '3',
    name: 'Oppa Travel',
    description: 'jamie@example.com',
    logo: 'https://picsum.photos/seed/oppa/50/50',
    totalMembers: 2,
    dueDate: '08 Jan 2024',
    progress: 90,
  },
];

export const taskCompletionData = {
  done: 40.5,
  remaining: 59.5,
  totalDone: 174,
  totalTasks: 218,
  growth: 12,
};
