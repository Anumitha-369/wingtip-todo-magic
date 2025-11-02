import { useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

export const useReminders = (tasks: Task[]) => {
  const checkedReminders = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.reminderTime && !task.completed && !checkedReminders.current.has(task.id)) {
          const reminderDate = new Date(task.reminderTime);
          
          if (now >= reminderDate) {
            checkedReminders.current.add(task.id);
            
            // Show toast with custom snooze options
            const toastId = toast.info(`⏰ Reminder: ${task.title}`, {
              description: task.description || 'Time to work on this task!',
              duration: 10000,
              action: {
                label: 'Snooze',
                onClick: () => {
                  toast.dismiss(toastId);
                  // Show snooze duration options
                  const snoozeToast = toast('Choose snooze duration', {
                    description: 'Select how long to snooze this reminder',
                    duration: Infinity,
                    action: {
                      label: '5 min',
                      onClick: () => {
                        checkedReminders.current.delete(task.id);
                        toast.dismiss(snoozeToast);
                        toast.success('Reminder snoozed for 5 minutes');
                      },
                    },
                    cancel: {
                      label: 'More options',
                      onClick: () => {
                        toast.dismiss(snoozeToast);
                        showMoreSnoozeOptions();
                      },
                    },
                  });

                  const showMoreSnoozeOptions = () => {
                    const options = [
                      { label: '10 minutes', value: 10 },
                      { label: '15 minutes', value: 15 },
                      { label: '30 minutes', value: 30 },
                      { label: '1 hour', value: 60 },
                      { label: '2 hours', value: 120 },
                    ];

                    options.forEach((option) => {
                      toast(option.label, {
                        duration: 5000,
                        action: {
                          label: 'Snooze',
                          onClick: () => {
                            checkedReminders.current.delete(task.id);
                            toast.success(`Reminder snoozed for ${option.label}`);
                          },
                        },
                      });
                    });
                  };
                },
              },
            });

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Task Reminder: ${task.title}`, {
                body: task.description || 'Time to work on this task!',
                icon: '/favicon.ico',
              });
            }
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [tasks]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
};
