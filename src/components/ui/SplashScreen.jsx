import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Allow animations to play before hiding splash screen
    const timer = setTimeout(() => {
      setIsAnimating(false);
      // Give a small delay after animations complete
      setTimeout(onFinish, 300);
    }, 2000); // Total animation duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center
                 transition-opacity duration-300 ${!isAnimating ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Logo Container */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center mb-2">
          <span className="text-5xl font-bold text-white animate-fade-in">
            Yoq
          </span>
          <span className="text-5xl font-light text-white animate-fade-in-delayed">
            Mi
          </span>
          <span className="text-3xl text-white/80 animate-bounce absolute -right-4 top-0">
            ?
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <ShoppingBag className="w-12 h-12 text-white/80 animate-float" />
        </div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-loader"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-loader" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-loader" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;