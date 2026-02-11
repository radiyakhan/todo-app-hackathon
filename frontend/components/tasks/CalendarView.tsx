'use client';

import { Task } from '@/types/task';
import { useState, useMemo } from 'react';
import { TaskItem } from './TaskItem';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: number) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
}

export function CalendarView({ tasks, onToggleComplete, onEdit, onDelete }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create array of days
    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return { days, monthName: monthNames[month], year };
  }, [currentDate]);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];

    return tasks.filter(task => {
      const taskDate = new Date(task.created_at);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get tasks for selected date
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Grid */}
      <div className="lg:col-span-2">
        <div className="glass-card p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {calendarData.monthName} {calendarData.year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousMonth}
                className="w-10 h-10 rounded-lg glass-button flex items-center justify-center hover:scale-105 transition-all duration-300"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="w-10 h-10 rounded-lg glass-button flex items-center justify-center hover:scale-105 transition-all duration-300"
                aria-label="Next month"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-white/70 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.days.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const hasHighPriority = dayTasks.some(t => t.priority === 'high');
              const hasMediumPriority = dayTasks.some(t => t.priority === 'medium');

              return (
                <button
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  disabled={!date}
                  className={`
                    aspect-square rounded-lg p-2 transition-all duration-300 relative
                    ${!date ? 'invisible' : ''}
                    ${isToday(date) ? 'ring-2 ring-white/50' : ''}
                    ${isSelected(date) ? 'bg-white/20 backdrop-blur-md' : 'glass-button'}
                    ${date && dayTasks.length > 0 ? 'hover:scale-105' : ''}
                  `}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-semibold ${isToday(date) ? 'text-white' : 'text-white/90'}`}>
                        {date.getDate()}
                      </div>
                      {dayTasks.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {hasHighPriority && (
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                          )}
                          {hasMediumPriority && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          )}
                          {!hasHighPriority && !hasMediumPriority && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Tasks */}
      <div className="lg:col-span-1">
        <div className="glass-card p-8 sticky top-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedDate ? (
              <>
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </>
            ) : (
              'Select a date'
            )}
          </h3>

          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {selectedDateTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-white/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white/60 text-sm">No tasks for this date</p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/60 text-sm">Click on a date to view tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
