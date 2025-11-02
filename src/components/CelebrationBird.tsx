import { useEffect, useState } from 'react';
import celebrationBirdImg from '@/assets/celebration-bird.png';

interface CelebrationBirdProps {
  show: boolean;
  onComplete: () => void;
}

const CelebrationBird = ({ show, onComplete }: CelebrationBirdProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <img 
        src={celebrationBirdImg} 
        alt="Celebration bird" 
        className="animate-fly-in w-64 h-48 object-contain"
      />
      
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: '50%',
            top: '50%',
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'][i % 5],
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CelebrationBird;
