import { useState, useEffect } from 'react';
import { ListTodo } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import CelebrationBird from '@/components/CelebrationBird';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import StatsPanel from '@/components/StatsPanel';
import ThemeSelector from '@/components/ThemeSelector';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReminders } from '@/hooks/useReminders';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);

  useReminders(tasks);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedStreak = localStorage.getItem('streak');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    toast.success('Task added successfully! 🎯');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          setShowCelebration(true);
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('streak', newStreak.toString());
          toast.success('Great job! Task completed! 🎉');
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.info('Task deleted');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <CelebrationBird show={showCelebration} onComplete={() => setShowCelebration(false)} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
        {/* Header */}
        <header className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ListTodo className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ff6b9d] via-[#ffd93d] to-[#6bcf7f] bg-clip-text text-transparent drop-shadow-lg">
              TaskMaster
            </h1>
            <div className="ml-4">
              <ThemeSelector />
            </div>
          </div>
          <p className="text-foreground/80 text-lg font-medium">Your awesome productivity companion ✨</p>
        </header>

        {/* Stats Panel */}
        <StatsPanel tasks={tasks} streak={streak} />

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 bg-card/80 backdrop-blur-sm rounded-xl p-2 border border-border">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
            className="flex-1"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'ghost'}
            onClick={() => setFilter('active')}
            className="flex-1"
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'ghost'}
            onClick={() => setFilter('completed')}
            className="flex-1"
          >
            Completed
          </Button>
        </div>

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAdd={addTask} />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
              <p className="text-muted-foreground text-lg">
                {filter === 'completed' ? '🎯 No completed tasks yet' : 
                 filter === 'active' ? '🎉 No active tasks! Time to add some!' :
                 '📝 No tasks yet. Create your first task!'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
