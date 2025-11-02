import { useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export const useReminders = (tasks: Task[], onUpdateTask: (id: string, updates: Partial<Task>) => void) => {
  const checkedReminders = useRef<Set<string>>(new Set());

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
                  showSnoozeOptions(task.id);
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
                // Show snooze options when user clicks notification
                showSnoozeOptions(task.id);
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

    const showSnoozeOptions = (taskId: string) => {
      const snoozeToast = toast('Choose snooze duration', {
        description: 'How long should we remind you again?',
        duration: Infinity,
        action: {
          label: '5 min',
          onClick: () => {
            toast.dismiss(snoozeToast);
            snoozeReminder(taskId, 5, '5 minutes');
          },
        },
        cancel: {
          label: 'More options',
          onClick: () => {
            toast.dismiss(snoozeToast);
            showMoreSnoozeOptions(taskId);
          },
        },
      });
    };

    const showMoreSnoozeOptions = (taskId: string) => {
      const options = [
        { label: '10 minutes', value: 10 },
        { label: '15 minutes', value: 15 },
        { label: '30 minutes', value: 30 },
        { label: '1 hour', value: 60 },
        { label: '2 hours', value: 120 },
      ];

      options.forEach((option) => {
        toast(option.label, {
          duration: 8000,
          action: {
            label: 'Snooze',
            onClick: () => {
              snoozeReminder(taskId, option.value, option.label);
            },
          },
        });
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [tasks]);

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
};
