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
            
            toast.info(`⏰ Reminder: ${task.title}`, {
              description: task.description || 'Time to work on this task!',
              action: {
                label: 'Snooze 10min',
                onClick: () => {
                  const snoozeTime = new Date(now.getTime() + 10 * 60 * 1000);
                  checkedReminders.current.delete(task.id);
                  toast.success('Reminder snoozed for 10 minutes');
                },
              },
              duration: 10000,
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
