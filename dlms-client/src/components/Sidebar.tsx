'use client'

import { motion } from 'framer-motion';
import { Home, Briefcase, Users, User, Settings, BarChart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Home', icon: <Home size={20} strokeWidth={2} />, path: '/home' },
  { name: 'Projects', icon: <Briefcase size={20} strokeWidth={2} />, path: '/projects' },
  { name: 'Users', icon: <Users size={20} strokeWidth={2} />, path: '/users' },
  { name: 'Profile', icon: <User size={20} strokeWidth={2} />, path: '/profile' },
  { name: 'Analytics', icon: <BarChart size={20} strokeWidth={2} />, path: '/analytics' },
  { name: 'Settings', icon: <Settings size={20} strokeWidth={2} />, path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gray-950 border-r border-gray-800 h-screen sticky top-0"
    >
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="font-bold text-2xl text-purple-400">DLabor</span>
        </Link>

        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-900/30 text-purple-100' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
                }`}
              >
                <div className={`${isActive ? 'text-purple-200' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Current Balance</div>
          <div className="text-xl font-bold text-purple-100">1234 DLT</div>
        </div>
      </div>
    </motion.div>
  );
}