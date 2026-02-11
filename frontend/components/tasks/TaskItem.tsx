'use client';

import { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PriorityBadge } from './PriorityBadge';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`glass-card glass-hover p-10 lg:p-12 rounded-2xl transition-all duration-300 animate-scale-in ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex flex-col space-y-8">
        {/* Top Row: Checkbox + Title + Priority */}
        <div className="flex items-start gap-6">
          <button
            onClick={handleToggle}
            disabled={isToggling || isDeleting}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
              task.completed
                ? 'bg-success border-success shadow-lg'
                : 'border-white/40 hover:border-white hover:bg-white/10'
            } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center group`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 pr-4">
            <h3 className={`text-lg font-bold leading-relaxed transition-all duration-300 ${
              task.completed ? 'line-through text-white/60' : 'text-white'
            }`}>
              {task.title}
            </h3>
          </div>

          <div className="flex-shrink-0">
            <PriorityBadge priority={task.priority} size="sm" />
          </div>
        </div>

        {/* Middle Section: Metadata */}
        <div className="flex items-center gap-4 flex-wrap text-sm text-white/60">
          <span className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-full backdrop-blur-md ${
            task.completed
              ? 'bg-success/20 text-white border border-success/30'
              : 'bg-white/10 text-white/70 border border-white/20'
          }`}>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(task.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {task.completed && (
            <span className="inline-flex items-center gap-2 font-medium px-4 py-2 rounded-full bg-success/20 text-white border border-success/30 backdrop-blur-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
          <Button
            size="md"
            variant="secondary"
            onClick={() => onEdit(task)}
            disabled={isDeleting}
            className="px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit</span>
          </Button>
          <Button
            size="md"
            variant="danger"
            onClick={handleDeleteClick}
            disabled={isToggling || isDeleting}
            className="px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
