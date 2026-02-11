// Task type definitions
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority: Priority;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: Priority;
  completed?: boolean;
}

export type TaskListResponse = Task[];
export type TaskResponse = Task;
