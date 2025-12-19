export interface KPIMetric {
  title: string;
  value: string;
  growth: number;
  data: { value: number }[];
  color: string;
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
  icon: React.ComponentType<any>;
  active?: boolean;
}
