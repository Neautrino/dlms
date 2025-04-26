'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, UserX, Star, ChevronDown, Briefcase, CalendarClock, Tag, MessageSquare, ExternalLink, Grid, List, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MOCK_USERS } from '@/lib/DummyData';
import { useAtom } from 'jotai';
import { viewModeAtom, selectedUserAtom, userFilterAtom } from '@/lib/atoms';
import { FullUserData, UserRole } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState<FullUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FullUserData[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Atoms
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [filters, setFilters] = useAtom(userFilterAtom);

  // Load mock data
  useEffect(() => {
    setUsers(MOCK_USERS);
    setFilteredUsers(MOCK_USERS);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      result = result.filter(user => 
        user.account.name.toLowerCase().includes(lowerSearch) ||
        user.metadata.bio.toLowerCase().includes(lowerSearch) ||
        (user.account.role === UserRole.Labor && 
          user.metadata.skillsets?.some(skill => 
            skill.toLowerCase().includes(lowerSearch)
          )
        ) ||
        (user.account.role === UserRole.Manager && 
          user.metadata.company?.toLowerCase().includes(lowerSearch)
        )
      );
    }
    
    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter(user => 
        filters.role === 'labor' ? user.account.role === UserRole.Labor : user.account.role === UserRole.Manager
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(user => 
        filters.status === 'active' ? user.account.active : !user.account.active
      );
    }
    
    // Apply verified filter
    if (filters.verified !== 'all') {
      result = result.filter(user => 
        filters.verified === 'verified' ? user.account.verified : !user.account.verified
      );
    }
    
    setFilteredUsers(result);
  }, [users, filters]);

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days/30)} months ago`;
    return `${Math.floor(days/365)} years ago`;
  };

  // Format rating to display as stars out of 5
  const formatRating = (rating: number) => {
    return (rating / 10).toFixed(1);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, skills, company..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2.5 w-full border-0 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </motion.button>
          </div>
          
          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Roles</option>
                        <option value="labor">Workers</option>
                        <option value="manager">Managers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification</label>
                      <select
                            value={filters.verified}
                            onChange={(e) => setFilters({ ...filters, verified: e.target.value as any })}
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Users</option>
                        <option value="verified">Verified Only</option>
                        <option value="unverified">Unverified Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* View mode toggle */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Table size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Grid size={20} />
            </button>
        </div>
        </motion.div>
        
        {/* Users listing */}
        {viewMode === 'grid' && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
              <Card
              key={user.account.authority}
                className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-hidden"
            >
                <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Image 
                    src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                    width={48} 
                    height={48} 
                    alt={user.account.name} 
                    className="rounded-full object-cover"
                  />
                  {user.account.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                      <UserCheck size={14} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 dark:text-white">{user.account.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm">{formatRating(user.account.rating)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Badge className={`
                          ${user.account.role === UserRole.Labor 
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'}
                        `}>
                      {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                        </Badge>
                        <Badge className={`
                          ${user.account.active 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'}
                        `}>
                      {user.account.active ? 'Active' : 'Inactive'}
                        </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {user.metadata.bio}
                  </p>
                  
                  {user.account.role === UserRole.Labor ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.metadata.skillsets?.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {skill}
                            </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{user.metadata.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </motion.div>
        )}
          
        {viewMode === 'list' && (
          <motion.div variants={itemVariants} className="space-y-4">
            {filteredUsers.map((user) => (
              <Card
                key={user.account.authority}
                className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image 
                        src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                        width={48} 
                        height={48} 
                        alt={user.account.name} 
                      className="rounded-full object-cover"
                    />
                      {user.account.verified && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                          <UserCheck size={14} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                      <div className="flex justify-between items-center">
                      <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{user.account.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Badge className={`
                              ${user.account.role === UserRole.Labor 
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                                : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'}
                            `}>
                              {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                            </Badge>
                            <Badge className={`
                              ${user.account.active 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'}
                            `}>
                              {user.account.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm">{formatRating(user.account.rating)}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {formatRelativeTime(user.account.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                          </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {viewMode === 'table' && (
          <motion.div variants={itemVariants} className="overflow-x-auto">
            <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 px-4 font-medium text-gray-500 dark:text-gray-400">User</th>
                      <th className="pb-3 px-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                      <th className="pb-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="pb-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rating</th>
                      <th className="pb-3 px-4 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.account.authority}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Image 
                                src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                                width={32} 
                                height={32} 
                                alt={user.account.name} 
                                className="rounded-full object-cover"
                              />
                              {user.account.verified && (
                                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                                  <UserCheck size={12} />
                            </div>
                          )}
                        </div>
                      <div>
                              <span className="font-medium text-gray-900 dark:text-white">{user.account.name}</span>
                              {user.account.role === UserRole.Labor && user.metadata.experience && (
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {user.metadata.experience[0]}
                                </div>
                              )}
                              {user.account.role === UserRole.Labor && user.metadata.skillsets && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {user.metadata.skillsets.slice(0, 3).map((skill, idx) => (
                                    <Badge key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                      {skill}
                                    </Badge>
                              ))}
                            </div>
                        )}
                      </div>
                    </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`
                            ${user.account.role === UserRole.Labor 
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                              : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'}
                          `}>
                            {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`
                            ${user.account.active 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800'}
                          `}>
                            {user.account.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} fill="currentColor" />
                            <span className="text-sm">{formatRating(user.account.rating)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(user.account.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {filteredUsers.length === 0 && (
          <motion.div variants={itemVariants} className="p-12 text-center">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
                    </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}