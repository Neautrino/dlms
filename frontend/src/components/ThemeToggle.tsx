'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, MoonStar, MonitorSmartphone } from 'lucide-react';
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
    <MoonStar className="h-6 w-6" />
  ) : theme === 'system' ? (
    <MonitorSmartphone className="h-6 w-6" />
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
            className={`absolute right-14 flex items-center ${contrastBg} rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-2xl z-20`}
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors`}
              onClick={() => handleThemeChange('light')}
              aria-label="Light theme"
              title="Light mode"
            >
              <Sun className="h-6 w-6 text-yellow-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors`}
              onClick={() => handleThemeChange('dark')}
              aria-label="Dark theme"
              title="Dark mode"
            >
              <MoonStar className="h-6 w-6 text-indigo-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${contrastBg} hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors`}
              onClick={() => handleThemeChange('system')}
              aria-label="System theme"
              title="System (device) mode"
            >
              <MonitorSmartphone className="h-6 w-6 text-green-500" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleExpand}
        className="relative z-30 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-full shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
        aria-label="Toggle theme selector"
        title="Change theme"
      >
        {currentIcon}
      </Button>
    </div>
  );
}