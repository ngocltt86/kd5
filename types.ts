
export enum TaskStatus {
  NOT_STARTED = 'Chưa làm',
  IN_PROGRESS = 'Đang làm',
  COMPLETED = 'Hoàn thành',
  OVERDUE = 'Trễ hạn'
}

export enum Priority {
  LOW = 'Thấp',
  MEDIUM = 'Trung bình',
  HIGH = 'Cao'
}

export interface KPIStats {
  net: number; // Internet
  pay: number; // FPT Play
  cam: number; // Camera
}

export interface Task {
  id: string;
  title: string;
  target: string;
  assignee: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  kpiType: 'NET' | 'PAY' | 'CAM' | 'MIX';
  kpiValue: number;
  notes: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
}

export interface ReportSummary {
  staffName: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  kpiTotal: KPIStats;
  score: number;
  rank: 'A' | 'B' | 'C';
}
