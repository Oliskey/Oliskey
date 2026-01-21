import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  isReady: boolean;
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isReady, onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar with stall logic
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If we are getting close to finish but data isn't ready, stall at 95%
        if (!isReady && prev >= 95) {
          return 95;
        }
        
        // If data IS ready, and we are stalled, quickly finish
        if (isReady && prev >= 95) {
           return Math.min(prev + 2, 100);
        }

        // Standard increment
        const increment = Math.random() * 4; 
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    // Trigger exit animation only when progress hits 100
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Unmount delay to match CSS transition
        setTimeout(() => {
            onComplete();
        }, 600); 
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center">
        {/* Logo Section */}
        <div className={`mb-12 transition-all duration-700 ${isExiting ? 'scale-95' : 'scale-100'}`}>
           <Logo className="h-24 w-24 md:h-32 md:w-32" variant="dark" showText={false} animated={true} />
        </div>

        {/* Text Logo */}
        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-10 animate-fade-in-up">
          Oliskey
        </h1>

        {/* Progress Bar Container */}
        <div className="w-64 md:w-80 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
          {/* Animated Bar */}
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Text */}
        <div className="mt-4 h-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                {progress < 100 ? 'Initializing...' : 'Ready'}
            </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-slate-300 text-xs font-medium tracking-wide">
         System. Culture. Creativity.
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;