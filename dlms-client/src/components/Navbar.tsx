'use client'

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Wallet, Filter, DollarSign, Search } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const tags = [
  'Solidity',
  'React',
  'Web3',
  'Smart Contracts',
  'DeFi',
  'NFT',
  'Frontend',
  'Backend',
  'UI/UX',
  'DevOps'
];

const priceRanges = [
  { label: 'Under 1000 DLT', value: '0-1000' },
  { label: '1000-5000 DLT', value: '1000-5000' },
  { label: '5000-10000 DLT', value: '5000-10000' },
  { label: 'Over 10000 DLT', value: '10000+' }
];

export default function Navbar() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  return (
    <motion.nav 
      className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-8">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-purple-900/20 rounded-full text-purple-700 dark:text-purple-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">1234 DLT</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="icon" variant="ghost" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <Bell className="w-5 h-5" />
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100">UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-purple-50 dark:focus:bg-purple-900/30">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-purple-50 dark:focus:bg-purple-900/30">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 focus:bg-purple-50 dark:focus:bg-purple-900/30">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}