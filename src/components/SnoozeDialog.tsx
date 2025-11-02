import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnooze: (minutes: number, label: string) => void;
  taskTitle: string;
}

export const SnoozeDialog = ({ open, onOpenChange, onSnooze, taskTitle }: SnoozeDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('5');

  const snoozeOptions = [
    { label: '2 minutes', value: '2', minutes: 2 },
    { label: '5 minutes', value: '5', minutes: 5 },
    { label: '10 minutes', value: '10', minutes: 10 },
    { label: '20 minutes', value: '20', minutes: 20 },
    { label: '30 minutes', value: '30', minutes: 30 },
    { label: '1 hour', value: '60', minutes: 60 },
    { label: '2 hours', value: '120', minutes: 120 },
    { label: '3 hours', value: '180', minutes: 180 },
    { label: 'Tomorrow', value: '1440', minutes: 1440 },
  ];

  const handleSnooze = () => {
    const option = snoozeOptions.find(opt => opt.value === selectedOption);
    if (option) {
      onSnooze(option.minutes, option.label);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Snooze Reminder
          </DialogTitle>
          <DialogDescription>
            {taskTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="space-y-3">
              {snoozeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer hover:text-primary transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSnooze}>
            Snooze
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
