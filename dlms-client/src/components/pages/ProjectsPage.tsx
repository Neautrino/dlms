'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Users, ChevronDown, Tag, ArrowUpRight, Briefcase, MapPin, Globe, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import  {MOCK_PROJECTS}  from '@/lib/DummyData';
import { FullProjectData, ProjectStatus } from '@/types/project';


// Mock data

export default function ProjectsListingPage() {
  const [projects, setProjects] = useState<FullProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<FullProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'remote' | 'onsite'>('all');
  const [rateSortOrder, setRateSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [durationSortOrder, setDurationSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Load mock data
  useEffect(() => {
    setProjects(MOCK_PROJECTS);
    setFilteredProjects(MOCK_PROJECTS);
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.metadata.category)))];

  // Apply filters and search
  useEffect(() => {
    let result = [...projects];
    
    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.project.title.toLowerCase().includes(lowerSearch) ||
        project.metadata.description.toLowerCase().includes(lowerSearch) ||
        project.metadata.requiredSkills.some(skill => skill.toLowerCase().includes(lowerSearch)) ||
        project.metadata.location.toLowerCase().includes(lowerSearch) ||
        project.metadata.company?.toLowerCase().includes(lowerSearch) ||
        project.metadata.managerName.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => {
        if (statusFilter === 'open') return project.project.status === ProjectStatus.Open;
        if (statusFilter === 'in-progress') return project.project.status === ProjectStatus.InProgress;
        if (statusFilter === 'completed') return project.project.status === ProjectStatus.Completed;
        if (statusFilter === 'cancelled') return project.project.status === ProjectStatus.Cancelled;
        return true;
      });
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(project => project.metadata.category === categoryFilter);
    }
    
    // Apply location filter
    if (locationFilter !== 'all') {
      result = result.filter(project => {
        if (locationFilter === 'remote') return project.metadata.remote === true;
        if (locationFilter === 'onsite') return project.metadata.remote === false;
        return true;
      });
    }
    
    // Apply sorting
    if (rateSortOrder !== 'none') {
      result.sort((a, b) => {
        if (rateSortOrder === 'asc') {
          return a.project.daily_rate - b.project.daily_rate;
        } else {
          return b.project.daily_rate - a.project.daily_rate;
        }
      });
    }
    
    if (durationSortOrder !== 'none') {
      result.sort((a, b) => {
        if (durationSortOrder === 'asc') {
          return a.project.duration_days - b.project.duration_days;
        } else {
          return b.project.duration_days - a.project.duration_days;
        }
      });
    }
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, categoryFilter, locationFilter, rateSortOrder, durationSortOrder]);

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

  // Format daily rate to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ProjectStatus }) => {
    let statusText: string;
    let statusClasses: string;
    
    switch (status) {
      case ProjectStatus.Open:
        statusText = 'Open';
        statusClasses = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
        break;
      case ProjectStatus.InProgress:
        statusText = 'In Progress';
        statusClasses = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
        break;
      case ProjectStatus.Completed:
        statusText = 'Completed';
        statusClasses = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        break;
      case ProjectStatus.Cancelled:
        statusText = 'Cancelled';
        statusClasses = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
        break;
      default:
        statusText = 'Unknown';
        statusClasses = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-1">DLabor Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Find and apply for skilled labor projects in your industry</p>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects by title, skills, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-0 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value as any)}
                        className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Locations</option>
                        <option value="remote">Remote Only</option>
                        <option value="onsite">On-site Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate</label>
                      <select
                        value={rateSortOrder}
                        onChange={(e) => {
                          setRateSortOrder(e.target.value as any);
                          setDurationSortOrder('none');
                        }}
                        className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="none">No Sorting</option>
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                      <select
                        value={durationSortOrder}
                        onChange={(e) => {
                          setDurationSortOrder(e.target.value as any);
                          setRateSortOrder('none');
                        }}
                        className="w-full p-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="none">No Sorting</option>
                        <option value="asc">Shortest First</option>
                        <option value="desc">Longest First</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Projects Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  statusFilter === 'open' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Open</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'in-progress' ? 'all' : 'in-progress')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  statusFilter === 'in-progress' 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">In Progress</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  statusFilter === 'completed' 
                    ? 'bg-gray-100 dark:bg-gray-700' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
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
        
        {/* Projects Grid/List */}
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        } gap-6`}>
          {filteredProjects.map((projectData) => (
            <Link href={`/projects/${projectData.project.index}`} key={projectData.project.index}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`flex ${
                  viewMode === 'list' ? 'flex-row' : 'flex-col'
                } rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 hover:ring-purple-500 dark:hover:ring-purple-400 transition-shadow h-full`}
              >
                <div className={`relative ${
                  viewMode === 'list' ? 'w-1/3' : 'w-full'
                }`}>
                  <Image 
                    src={projectData.metadata.projectImage || "/api/placeholder/400/200"} 
                    width={400} 
                    height={200} 
                    alt={projectData.project.title}
                    className={`${
                      viewMode === 'list' ? 'h-full' : 'h-40'
                    } w-full object-cover`}
                  />
                  <div className="absolute bottom-0 right-0 p-2">
                    <StatusBadge status={projectData.project.status} />
                  </div>
                </div>
                
                <div className={`p-5 flex-grow flex flex-col ${
                  viewMode === 'list' ? 'w-2/3' : ''
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold line-clamp-2">{projectData.project.title}</h3>
                    <div className="text-purple-600 dark:text-purple-400 font-bold whitespace-nowrap">
                      {formatCurrency(projectData.project.daily_rate)}/day
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {projectData.metadata.description}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {projectData.metadata.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {skill}
                      </span>
                    ))}
                    {projectData.metadata.requiredSkills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        +{projectData.metadata.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{projectData.project.duration_days} days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{projectData.project.labour_count}/{projectData.project.max_labourers} hired</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} />
                        <span>{projectData.metadata.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {projectData.metadata.remote ? (
                          <>
                            <Globe size={14} />
                            <span>Remote</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={14} />
                            <span>{projectData.metadata.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center gap-1">
                        <div className="relative w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                            {projectData.metadata.managerName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">{projectData.metadata.managerName}</span>
                        {projectData.metadata.company && (
                          <span className="text-gray-500 dark:text-gray-400 ml-1">
                            • {projectData.metadata.company}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Posted {formatRelativeTime(projectData.project.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="p-12 text-center">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
        
        {/* Pagination - simplified version */}
        {filteredProjects.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium">
                1
              </button>
              <button className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                3
              </button>
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
              <button className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}