'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, UserX, Star, ChevronDown, Grid, List, Table, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FullUserData, UserRole } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/atoms';
import axios from 'axios';

export default function UsersPage() { 
  const [users, setUsers] = useState<FullUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FullUserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'labor' | 'manager'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [atomUsers, setAtomUsers] = useAtom(userAtom);
  
  const router = useRouter();
  
  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/users-state');
      
      if (!response.data) {
        throw new Error('Failed to fetch users');
      }
      
      const data = response.data;
      console.log("Users response: ", data);
      setUsers(data);
      setFilteredUsers(data);
      setAtomUsers(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      setIsLoading(false);
    }
  };

  // Initialize users from atom if available
  useEffect(() => {
    if (atomUsers) {
      setUsers(atomUsers);
      setFilteredUsers(atomUsers);
      setIsLoading(false);
    } else {
      fetchUsers();
    }
  }, [atomUsers]);

  // Apply filters and search
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(user => {
        return (
          user.account.name.toLowerCase().includes(lowerSearch)
        );
      });
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => 
        roleFilter === 'labor' ? user.account.role === UserRole.Labour : user.account.role === UserRole.Manager
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => 
        statusFilter === 'active' ? user.account.active : !user.account.active
      );
    }
    
    // Apply verified filter
    if (verifiedFilter !== 'all') {
      result = result.filter(user => 
        verifiedFilter === 'verified' ? user.account.verified : !user.account.verified
      );
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, verifiedFilter]);

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    // Convert timestamp from seconds to milliseconds
    const timestampMs = timestamp * 1000;
    const diff = Date.now() - timestampMs;
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

  // Navigate to user details page
  const handleUserClick = (user: FullUserData) => {
    router.push(`/users/${user.account.authority}`);
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full border-0 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
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
              </div>
              
              {/* View mode toggle */}
              <div className="flex justify-between items-center mb-4">
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
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={fetchUsers}
                    className={`p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300`}
                  >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                  </motion.button>
                </div>
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
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                          <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="all">All Roles</option>
                            <option value="labor">Workers</option>
                            <option value="manager">Managers</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification</label>
                          <select
                            value={verifiedFilter}
                            onChange={(e) => setVerifiedFilter(e.target.value as any)}
                            className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="p-6 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        )}
        
        {/* Users listing */}
        {!isLoading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.account.authority}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    onClick={() => handleUserClick(user)}
                    className="rounded-xl bg-white dark:bg-gray-900 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300"
                  >
                    {/* Card header with background gradient */}
                    <div className={`h-16 ${user.account.role === UserRole.Labour ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} />
                    
                    <div className="relative px-5 pt-0 pb-5">
                      {/* Profile image overlapping the header */}
                      <div className="absolute -top-10 left-5">
                        <div className="relative inline-block">
                          <div className="rounded-full p-1 bg-white dark:bg-gray-900">
                            <Image 
                              src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                              width={60} 
                              height={60} 
                              alt={user.account.name} 
                              className="rounded-full object-cover border-2 border-white dark:border-gray-800"
                            />
                          </div>
                          {user.account.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900">
                              <UserCheck size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Card content with proper spacing */}
                      <div className="mt-12">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{user.account.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 shrink-0 ml-2">
                            <Star size={18} fill="currentColor" strokeWidth={0} />
                            <span className="font-medium">{formatRating(user.account.rating)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({user.account.rating_count})</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3">
                          {user.account.authority.slice(0,6)+"..."+user.account.authority.slice(-6)}
                        </div>
                        
                        {/* Bio section - ADDED */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                            {user.metadata.bio || "No bio available."}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.account.role === UserRole.Labour 
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' 
                              : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200'
                          }`}>
                            {user.account.role === UserRole.Labour ? 'Worker' : 'Manager'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.account.active 
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                          }`}>
                            {user.account.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Joined {formatRelativeTime(user.account.timestamp)}
                          </div>
                          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                            <motion.div 
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-1 text-xs font-medium"
                            >
                              View Profile
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                              </svg>
                            </motion.div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">User</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Bio</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Role</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Rating</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <motion.tr 
                          key={user.account.authority}
                          onClick={() => handleUserClick(user)}
                          whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="cursor-pointer transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <Image 
                                  src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                                  width={40} 
                                  height={40} 
                                  alt={user.account.name} 
                                  className="rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                                />
                                {user.account.verified && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                                    <UserCheck size={12} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{user.account.name}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                  {user.account.authority.slice(0,6)+"..."+user.account.authority.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {truncateText(user.metadata.bio || "No bio available.", 60)}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.account.role === UserRole.Labour 
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' 
                                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200'
                            }`}>
                              {user.account.role === UserRole.Labour ? 'Worker' : 'Manager'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.account.active 
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' 
                                : 'bg-gray-100 dark:bg-gray-700/70 text-gray-800 dark:text-gray-300'
                            }`}>
                              {user.account.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star size={16} fill="currentColor" strokeWidth={0} />
                              <span className="text-sm font-medium">{formatRating(user.account.rating)}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">({user.account.rating_count})</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(user.account.timestamp)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your criteria. Try adjusting your search or filters.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}