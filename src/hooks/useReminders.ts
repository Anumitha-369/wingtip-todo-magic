import { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

interface SnoozeState {
  taskId: string;
  taskTitle: string;
}

export const useReminders = (tasks: Task[], onUpdateTask: (id: string, updates: Partial<Task>) => void) => {
  const checkedReminders = useRef<Set<string>>(new Set());
  const [snoozeDialogState, setSnoozeDialogState] = useState<SnoozeState | null>(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.reminderTime && !task.completed && !checkedReminders.current.has(task.id)) {
          const reminderDate = new Date(task.reminderTime);
          
          if (now >= reminderDate) {
            checkedReminders.current.add(task.id);
            
            // Show toast with custom snooze options (only when app is in focus)
            const toastId = toast.info(`⏰ Reminder: ${task.title}`, {
              description: task.description || 'Time to work on this task!',
              duration: 15000,
              action: {
                label: 'Snooze',
                onClick: () => {
                  toast.dismiss(toastId);
                  setSnoozeDialogState({ taskId: task.id, taskTitle: task.title });
                },
              },
            });

            // Browser notification (works even when app is in background/other apps)
            if ('Notification' in window && Notification.permission === 'granted') {
              const notification = new Notification(`⏰ Task Reminder: ${task.title}`, {
                body: task.description || 'Time to work on this task!',
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: task.id,
                requireInteraction: true, // Keep notification visible until user interacts
                silent: false,
              });

              // Handle notification click - bring user back to app
              notification.onclick = () => {
                window.focus();
                notification.close();
                // Show snooze dialog when user clicks notification
                setSnoozeDialogState({ taskId: task.id, taskTitle: task.title });
              };
            }
          }
        }
      });
    };

    const snoozeReminder = (taskId: string, minutes: number, label: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newReminderTime = new Date(Date.now() + minutes * 60 * 1000);
      checkedReminders.current.delete(taskId);
      onUpdateTask(taskId, { reminderTime: newReminderTime.toISOString() });
      toast.success(`⏰ Reminder snoozed for ${label}`);
    };


    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds for more accurate notifications
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [tasks, onUpdateTask]);

  // Request notification permission on mount with user-friendly prompt
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Show a toast to ask for permission
      toast.info('Enable notifications to get reminders even when using other apps', {
        duration: 10000,
        action: {
          label: 'Enable',
          onClick: () => {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                toast.success('Notifications enabled! You\'ll receive reminders even in other apps.');
              }
            });
          },
        },
      });
    }
  }, []);

  return {
    snoozeDialogState,
    setSnoozeDialogState,
    snoozeReminder: (taskId: string, minutes: number, label: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newReminderTime = new Date(Date.now() + minutes * 60 * 1000);
      checkedReminders.current.delete(taskId);
      onUpdateTask(taskId, { reminderTime: newReminderTime.toISOString() });
      toast.success(`⏰ Reminder snoozed for ${label}`);
    },
  };
};
