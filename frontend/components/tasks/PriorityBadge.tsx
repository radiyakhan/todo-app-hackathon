'use client';

import { Priority } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

const priorityConfig = {
  high: {
    label: 'High',
    icon: '🔴',
    className: 'bg-red-500/20 text-red-100 border-red-400/30',
  },
  medium: {
    label: 'Medium',
    icon: '🟡',
    className: 'bg-amber-500/20 text-amber-100 border-amber-400/30',
  },
  low: {
    label: 'Low',
    icon: '🟢',
    className: 'bg-green-500/20 text-green-100 border-green-400/30',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full backdrop-blur-md border transition-all duration-300 ${config.className} ${sizeClass}`}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
