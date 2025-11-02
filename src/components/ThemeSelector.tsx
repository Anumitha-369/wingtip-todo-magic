import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Theme } from '@/types/task';

const themes: { value: Theme; label: string; description: string }[] = [
  { value: 'gradient', label: '🎨 Default Gradient', description: 'Vibrant purple & pink gradients' },
  { value: 'natural', label: '🌿 Natural', description: 'Peaceful mountains & forests' },
  { value: 'multicolor', label: '🌈 Multicolor', description: 'Bright rainbow colors' },
  { value: 'calm', label: '😌 Calm & Subtle', description: 'Soft pastel colors' },
  { value: 'floral', label: '🌸 Floral Black', description: 'Black with white flowers' },
  { value: 'cartoon', label: '🎭 Cartoon Fun', description: 'Shinchan, Doraemon & friends' },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm">
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={theme === t.value ? 'bg-primary/10' : ''}
          >
            <div>
              <div className="font-medium">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
