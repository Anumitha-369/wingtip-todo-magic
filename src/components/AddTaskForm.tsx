import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';

interface AddTaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  editTask?: Task | null;
  onUpdate?: (id: string, task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onCancelEdit?: () => void;
}

const AddTaskForm = ({ onAdd, editTask, onUpdate, onCancelEdit }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (editTask) {
      setIsOpen(true);
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate || '');
      setReminderTime(editTask.reminderTime || '');
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editTask && onUpdate) {
      onUpdate(editTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        reminderTime: reminderTime || undefined,
      });
    } else {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || undefined,
        reminderTime: reminderTime || undefined,
      });
    }

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setReminderTime('');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setReminderTime('');
    setIsOpen(false);
    if (onCancelEdit) onCancelEdit();
  };

  if (!isOpen && !editTask) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          {editTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={handleCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <Input
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background/50"
          autoFocus
        />
        
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background/50 resize-none"
          rows={3}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-background/50"
            placeholder="Due Date"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Set Reminder (Optional)</label>
          <Input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-background/50"
            placeholder="Reminder Time"
          />
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            {editTask ? 'Update Task' : 'Add Task'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
