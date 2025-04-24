'use client'

import { motion } from 'framer-motion';
import { Home, Briefcase, Users, User, Settings, BarChart, Wallet, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

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
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gray-950 border-r border-gray-800 h-screen sticky top-0 flex flex-col"
    >
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="font-bold text-2xl text-purple-400">DLabor</span>
        </Link>

        <div className="mb-8">
          <div 
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800 cursor-pointer mb-2"
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/01.png" alt="@username" />
              <AvatarFallback className="bg-purple-900 text-purple-100">UN</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-100 truncate">Username</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
          </div>
          
          {isProfileExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="ml-2 pl-3 border-l border-gray-800 space-y-2"
            >
              <Link href="/profile" className="flex items-center gap-2 py-2 text-sm text-gray-400 hover:text-gray-100">
                <User size={16} />
                <span>View Profile</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-2 py-2 text-sm text-gray-400 hover:text-gray-100">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <Link href="/logout" className="flex items-center gap-2 py-2 text-sm text-gray-400 hover:text-gray-100">
                <LogOut size={16} />
                <span>Logout</span>
              </Link>
            </motion.div>
          )}
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
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
      
      <div className="mt-auto px-6 pb-6 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div>
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-xl font-bold text-purple-100">1234 DLT</div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Wallet className="text-purple-400 h-6 w-6" />
          </motion.div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800">
                <Bell className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}