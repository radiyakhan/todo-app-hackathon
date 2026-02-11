'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Task, TaskCreate, Priority } from '@/types/task';
import { useEffect } from 'react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  priority: z.enum(['high', 'medium', 'low']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskCreate) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      priority: task.priority,
    } : {
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        priority: task.priority,
      });
    }
  }, [task, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      title: data.title,
      priority: data.priority,
      description: '', // Send empty string for description
    });
    if (!task) {
      reset({ title: '', priority: 'medium' }); // Clear form after creating new task
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('title')}
          label="Task Title"
          placeholder="Enter a clear, actionable task title..."
          error={errors.title?.message}
          disabled={isLoading}
          className="transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-semibold text-white mb-2">
          Priority Level
        </label>
        <select
          {...register('priority')}
          id="priority"
          className="glass-input block w-full px-4 py-3 rounded-xl shadow-lg text-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={isLoading}
        >
          <option value="high" className="bg-gray-900 text-white">
            🔴 High Priority
          </option>
          <option value="medium" className="bg-gray-900 text-white">
            🟡 Medium Priority
          </option>
          <option value="low" className="bg-gray-900 text-white">
            🟢 Low Priority
          </option>
        </select>
        {errors.priority && (
          <p className="mt-2 text-sm text-red-300 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.priority.message}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="glass"
          isLoading={isLoading}
          className="shadow-lg hover:shadow-xl"
        >
          {task ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Update Task
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
