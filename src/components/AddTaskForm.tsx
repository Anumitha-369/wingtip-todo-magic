import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';

interface AddTaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsOpen(false);
  };

  if (!isOpen) {
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
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">Create New Task</h3>
      
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
          />
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            Add Task
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
