export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  reminderTime?: string;
  createdAt: string;
}

export type Theme = 'gradient' | 'natural' | 'multicolor' | 'calm' | 'floral' | 'cartoon';
