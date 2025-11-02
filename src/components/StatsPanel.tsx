import { CheckCircle2, Circle, Flame, Target } from 'lucide-react';
import { Task } from '@/types/task';

interface StatsPanelProps {
  tasks: Task[];
  streak: number;
}

const StatsPanel = ({ tasks, streak }: StatsPanelProps) => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
        </div>
        <p className="text-2xl font-bold text-card-foreground">{total}</p>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span className="text-sm font-medium text-muted-foreground">Completed</span>
        </div>
        <p className="text-2xl font-bold text-success">{completed}</p>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Circle className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
        </div>
        <p className="text-2xl font-bold text-accent">{percentage}%</p>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-destructive" />
          <span className="text-sm font-medium text-muted-foreground">Streak</span>
        </div>
        <p className="text-2xl font-bold text-destructive">{streak} days</p>
      </div>
    </div>
  );
};

export default StatsPanel;
