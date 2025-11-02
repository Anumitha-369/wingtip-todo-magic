import { useTheme } from '@/contexts/ThemeContext';
import naturalBg from '@/assets/natural-theme-bg.png';
import cartoonBg from '@/assets/cartoon-theme-bg.png';
import floralBg from '@/assets/floral-theme-bg.png';

const AnimatedBackground = () => {
  const { theme } = useTheme();

  const getBackgroundStyle = () => {
    switch (theme) {
      case 'natural':
        return { backgroundImage: `url(${naturalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'cartoon':
        return { backgroundImage: `url(${cartoonBg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'floral':
        return { backgroundImage: `url(${floralBg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'multicolor':
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)' };
      case 'calm':
        return { background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)' };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-primary" style={getBackgroundStyle()}>
      {/* Floating bubbles moving upward */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-bubble-rise"
          style={{
            width: Math.random() * 100 + 50 + 'px',
            height: Math.random() * 100 + 50 + 'px',
            left: Math.random() * 100 + '%',
            bottom: '-100px',
            animationDuration: `${Math.random() * 4 + 6}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30" />
    </div>
  );
};

export default AnimatedBackground;
