import { useEffect, useState } from 'react';

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
      <div className="animate-fly-in text-8xl">
        🐦👍
      </div>
      
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
