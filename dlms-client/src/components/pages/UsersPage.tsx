'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, UserX, Star, ChevronDown, Briefcase, CalendarClock, Tag, MessageSquare, ExternalLink, Grid, List, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MOCK_USERS } from '@/lib/DummyData';
import { useAtom } from 'jotai';
import { viewModeAtom, selectedUserAtom, userFilterAtom } from '@/lib/atoms';
import { FullUserData, UserRole } from '@/types/user';

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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Browse and search DLabor users</p>
        
        {/* Search and filters */}
        <div className="mb-6">
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
                className="pl-10 pr-4 py-2.5 w-full border-0 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
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
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
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
                        value={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.value as any })}
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
        </div>

        {/* View mode toggle */}
        <div className="flex justify-between items-center mb-6">
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
        </div>
        
        {/* Users listing */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.account.authority}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedUser(user)}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 cursor-pointer hover:ring-purple-500 dark:hover:ring-purple-400 transition-shadow"
              >
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
                      <h3 className="font-medium">{user.account.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm">{formatRating(user.account.rating)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.account.role === UserRole.Labor 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      }`}>
                        {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.account.active 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {user.account.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {user.metadata.bio}
                    </p>
                    
                    {user.account.role === UserRole.Labor ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.metadata.skillsets?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{user.metadata.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.account.authority}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedUser(user)}
                className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 cursor-pointer hover:ring-purple-500 dark:hover:ring-purple-400 transition-shadow"
              >
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
                        <h3 className="font-medium">{user.account.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.account.role === UserRole.Labor 
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                              : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          }`}>
                            {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.account.active 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {user.account.active ? 'Active' : 'Inactive'}
                          </span>
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
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Rating</th>
                  <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.account.authority}
                    onClick={() => setSelectedUser(user)}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <td className="py-4">
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
                          <span className="font-medium">{user.account.name}</span>
                          {user.account.role === UserRole.Labor && user.metadata.experience && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {user.metadata.experience[0]}
                            </div>
                          )}
                          {user.account.role === UserRole.Labor && user.metadata.skillsets && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {user.metadata.skillsets.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.account.role === UserRole.Labor 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      }`}>
                        {user.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.account.active 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {user.account.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm">{formatRating(user.account.rating)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(user.account.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No users found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      
      {/* User detail modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <Image 
                      src={selectedUser.metadata.profileImage || "/api/placeholder/80/80"} 
                      width={80} 
                      height={80} 
                      alt={selectedUser.account.name} 
                      className="rounded-full object-cover"
                    />
                    {selectedUser.account.verified && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                        <UserCheck size={18} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold">{selectedUser.account.name}</h2>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={20} fill="currentColor" />
                        <span className="text-lg">{formatRating(selectedUser.account.rating)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({selectedUser.account.rating_count} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        selectedUser.account.role === UserRole.Labor 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      }`}>
                        {selectedUser.account.role === UserRole.Labor ? 'Worker' : 'Manager'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        selectedUser.account.active 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {selectedUser.account.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Age: {selectedUser.metadata.age}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Joined {formatRelativeTime(selectedUser.account.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedUser.metadata.bio}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  {selectedUser.account.role === UserRole.Labor ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Briefcase size={18} className="text-purple-500" />
                          Experience
                        </h3>
                        <ul className="space-y-2">
                          {selectedUser.metadata.experience?.map((exp, idx) => (
                            <li key={idx} className="text-gray-600 dark:text-gray-300">• {exp}</li>
                          ))}
                        </ul>
                        
                        <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                          <Tag size={18} className="text-purple-500" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.metadata.skillsets?.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <CalendarClock size={18} className="text-purple-500" />
                          Details
                        </h3>
                        
                        <div className="space-y-3 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Availability</span>
                            <span>{selectedUser.metadata.availability}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Hourly Rate</span>
                            <span>${selectedUser.metadata.hourlyRate}/hr</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Preferred Location</span>
                            <span>{selectedUser.metadata.preferredLocation}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Languages</span>
                            <span>{selectedUser.metadata.languages?.join(', ')}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                            <MessageSquare size={18} className="text-purple-500" />
                            Certifications
                          </h3>
                          <ul className="space-y-2">
                            {selectedUser.metadata.certifications?.map((cert, idx) => (
                              <li key={idx} className="text-gray-600 dark:text-gray-300">• {cert}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Briefcase size={18} className="text-purple-500" />
                          Company Details
                        </h3>
                        
                        <div className="space-y-3 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Company Name</span>
                            <span className="font-medium">{selectedUser.metadata.company}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Industry</span>
                            <span>{selectedUser.metadata.companyDetails?.industry}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Size</span>
                            <span>{selectedUser.metadata.companyDetails?.size}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Founded</span>
                            <span>{selectedUser.metadata.companyDetails?.founded}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Location</span>
                            <span>{selectedUser.metadata.companyDetails?.location}</span>
                          </div>
                          
                          {selectedUser.metadata.companyDetails?.website && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Website</span>
                              <a 
                                href={`https://${selectedUser.metadata.companyDetails.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1"
                              >
                                {selectedUser.metadata.companyDetails.website}
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <CalendarClock size={18} className="text-purple-500" />
                          Hiring Details
                        </h3>
                        
                        <div className="space-y-3 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Hiring Frequency</span>
                            <span>{selectedUser.metadata.hiringFrequency}</span>
                          </div>
                        </div>
                        
                        {selectedUser.metadata.projectHistory && (
                          <>
                            <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                              <Briefcase size={18} className="text-purple-500" />
                              Project History
                            </h3>
                            <div className="space-y-4">
                              {selectedUser.metadata.projectHistory.map((project, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                                  <h4 className="font-medium">{project.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Duration: {project.duration}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User account details */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                  <h3 className="text-lg font-semibold mb-3">Account Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">User ID</span>
                      <span className="font-mono text-sm truncate">{selectedUser.account.authority}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">IPFS URI</span>
                      <span className="font-mono text-sm truncate">{selectedUser.account.metadata_uri}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                    Contact User
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 text-gray-800 dark:text-gray-200 font-medium transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}