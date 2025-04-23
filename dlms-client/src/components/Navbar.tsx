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
      className="border-b border-gray-800 bg-gray-950"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center gap-8">
        <motion.div 
          className="flex-1 flex items-center gap-4"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects, skills, or users..."
                className="w-full rounded-full bg-gray-900 border-gray-800 pl-10 focus-visible:ring-purple-500/20"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium text-gray-200">Skills & Technologies</h4>
                  <div className="space-y-1">
                    {tags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag]);
                          } else {
                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                          }
                        }}
                        className="text-gray-300 focus:bg-purple-900/30"
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-gray-400 hover:text-white hover:bg-gray-800">
                  <DollarSign className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium text-gray-200">Price Range</h4>
                  <div className="space-y-1">
                    {priceRanges.map((range) => (
                      <DropdownMenuCheckboxItem
                        key={range.value}
                        checked={selectedPriceRange === range.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRange(range.value);
                          } else {
                            setSelectedPriceRange('');
                          }
                        }}
                        className="text-gray-300 focus:bg-purple-900/30"
                      >
                        {range.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            {selectedTags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-3 py-1 rounded-full bg-purple-900/20 text-sm font-medium flex items-center gap-2 text-purple-200"
              >
                {tag}
                <button
                  onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                  className="hover:text-purple-400"
                >
                  ×
                </button>
              </motion.div>
            ))}
            {selectedPriceRange && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-3 py-1 rounded-full bg-purple-900/20 text-sm font-medium flex items-center gap-2 text-purple-200"
              >
                {priceRanges.find(r => r.value === selectedPriceRange)?.label}
                <button
                  onClick={() => setSelectedPriceRange('')}
                  className="hover:text-purple-400"
                >
                  ×
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-4">

          <ThemeToggle />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/20 rounded-full text-purple-100"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">1234 DLT</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Bell className="w-5 h-5" />
            </Button>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback className="bg-purple-900 text-purple-100">UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-900/30">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-900/30">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-900/30">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}