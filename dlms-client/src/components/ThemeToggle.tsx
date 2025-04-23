'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsExpanded(false);
  };

  // Determine the icon to show based on current theme
  const currentIcon = theme === 'dark' ? (
    <Moon className="h-6 w-6" />
  ) : theme === 'system' ? (
    <Laptop className="h-6 w-6" />
  ) : (
    <Sun className="h-6 w-6" />
  );

  const effectiveTheme = resolvedTheme || theme;
  
  const contrastBg = effectiveTheme === 'dark' 
    ? 'bg-white text-black' 
    : 'bg-gray-900 text-white';

    console.log(theme);

  return (
    <div className="relative flex items-center justify-end">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={`absolute right-14 flex items-center ${contrastBg} rounded-full overflow-hidden border border-border shadow-md`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-opacity-80`}
              onClick={() => handleThemeChange('light')}
              aria-label="Light theme"
            >
              <Sun className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-opacity-80`}
              onClick={() => handleThemeChange('dark')}
              aria-label="Dark theme"
            >
              <Moon className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-opacity-80`}
              onClick={() => handleThemeChange('system')}
              aria-label="System theme"
            >
              <Laptop className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleExpand}
        className="relative z-10 bg-card hover:bg-card/80 rounded-full"
        aria-label="Toggle theme selector"
      >
        {currentIcon}
      </Button>
    </div>
  );
}