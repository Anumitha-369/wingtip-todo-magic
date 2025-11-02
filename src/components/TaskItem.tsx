import { Trash2, Flag, Pencil } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityColors = {
  low: 'border-l-success',
  medium: 'border-l-secondary',
  high: 'border-l-accent',
};

const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  return (
    <div
      className={`group bg-card/80 backdrop-blur-sm border-l-4 ${
        priorityColors[task.priority]
      } rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium transition-all duration-300 ${
              task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Flag className="w-3 h-3" />
            <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
            {task.dueDate && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task.id)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
