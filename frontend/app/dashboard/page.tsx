'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Task, TaskCreate, TaskUpdate } from '@/types/task';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { CalendarView } from '@/components/tasks/CalendarView';
import { EmptyState } from '@/components/tasks/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Sidebar } from '@/components/layout/Sidebar';
import { toast } from 'sonner';

type ViewMode = 'list' | 'calendar';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, signout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Load tasks once authenticated
    if (isAuthenticated && user) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, user]);

  const loadTasks = async () => {
    if (!user) return;

    setIsLoadingTasks(true);
    setError(null);

    try {
      const taskList = await api.tasks.list(user.id);
      setTasks(taskList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleCreateTask = async (data: TaskCreate) => {
    if (!user) return;

    setIsCreating(true);
    setError(null);

    try {
      const newTask = await api.tasks.create(user.id, data);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!', {
        description: data.title,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (data: TaskCreate) => {
    if (!user || !editingTask) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedTask = await api.tasks.update(user.id, editingTask.id, data);
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      setEditingTask(null);
      toast.success('Task updated successfully!', {
        description: data.title,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!user) return;

    try {
      const updatedTask = await api.tasks.toggleComplete(user.id, taskId);
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      toast.success(
        updatedTask.completed ? 'Task marked as complete!' : 'Task marked as incomplete',
        {
          description: updatedTask.title,
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      await api.tasks.delete(user.id, taskId);
      const deletedTask = tasks.find((t) => t.id === taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success('Task deleted successfully!', {
        description: deletedTask?.title,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSignout = async () => {
    try {
      await signout();
      toast.success('Signed out successfully', {
        description: 'See you next time!',
      });
      router.push('/signin');
    } catch (err) {
      const errorMessage = 'Failed to sign out';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Show loading spinner while checking auth or if user data is not yet available
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to signin if not authenticated (handled by useEffect above)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        tasks={tasks}
        onSignout={handleSignout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 w-12 h-12 glass-button rounded-xl flex items-center justify-center shadow-lg"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in mt-16 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
            <p className="text-base sm:text-lg text-white/70">Manage your tasks and stay productive</p>
          </div>

          {error && (
            <div className="mb-6 animate-slide-down">
              <ErrorMessage message={error} onRetry={loadTasks} />
            </div>
          )}

          {/* Create/Edit Task Form */}
          <div className="glass-card p-6 sm:p-8 mb-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              {editingTask ? (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Task</h2>
                    <p className="text-xs sm:text-sm text-white/70">Update your task details</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Create New Task</h2>
                    <p className="text-xs sm:text-sm text-white/70">Add a new task to your list</p>
                  </div>
                </>
              )}
            </div>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={editingTask ? () => setEditingTask(null) : undefined}
              isLoading={isCreating || isUpdating}
            />
          </div>

          {/* Task List Section */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Your Tasks</h2>
                  <p className="text-xs sm:text-sm text-white/70">Manage and track your progress</p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 glass-card p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'calendar'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Calendar</span>
                </button>
              </div>
            </div>

            {isLoadingTasks ? (
              <div className="glass-card p-16 flex flex-col items-center justify-center">
                <Spinner size="lg" />
                <p className="mt-4 text-sm text-white/70">Loading your tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass-card">
                <EmptyState />
              </div>
            ) : viewMode === 'list' ? (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ) : (
              <CalendarView
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
