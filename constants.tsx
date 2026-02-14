
import React from 'react';
import { Staff, Task, TaskStatus, Priority } from './types';

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Nguyễn Văn An', email: 'annv@fpt.com', position: 'NVKD' },
  { id: '2', name: 'Trần Thị Bình', email: 'binhtt@fpt.com', position: 'NVKD' },
  { id: '3', name: 'Lê Văn Cường', email: 'cuonglv@fpt.com', position: 'NVKD' },
  { id: '4', name: 'Phạm Minh Đức', email: 'duclm@fpt.com', position: 'NVKD' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Phát tờ rơi khu vực Phường 1',
    target: 'Tiếp cận 100 khách hàng',
    assignee: 'Nguyễn Văn An',
    deadline: '2023-10-25',
    priority: Priority.HIGH,
    status: TaskStatus.COMPLETED,
    kpiType: 'NET',
    kpiValue: 5,
    notes: 'Ưu tiên chung cư cũ',
    createdAt: '2023-10-20'
  },
  {
    id: 't2',
    title: 'Telesale danh sách cũ',
    target: 'Chốt 2 Camera',
    assignee: 'Trần Thị Bình',
    deadline: '2023-10-26',
    priority: Priority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
    kpiType: 'CAM',
    kpiValue: 2,
    notes: 'Liên hệ vào khung giờ 19h-21h',
    createdAt: '2023-10-21'
  },
  {
    id: 't3',
    title: 'Demo FPT Play tại sự kiện',
    target: '10 user đăng ký mới',
    assignee: 'Nguyễn Văn An',
    deadline: '2023-10-24',
    priority: Priority.HIGH,
    status: TaskStatus.OVERDUE,
    kpiType: 'PAY',
    kpiValue: 10,
    notes: 'Chuẩn bị thêm quà tặng',
    createdAt: '2023-10-22'
  }
];

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED: return 'bg-green-100 text-green-800';
    case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
    case TaskStatus.OVERDUE: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priority.HIGH: return 'text-red-600';
    case Priority.MEDIUM: return 'text-orange-500';
    case Priority.LOW: return 'text-blue-500';
    default: return 'text-gray-500';
  }
};
