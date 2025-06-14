'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Users, ChevronDown, Tag, ArrowUpRight, Briefcase, MapPin, Globe, Grid, List, Plus, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FullProjectData, ProjectStatus } from '@/types/project';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAtom } from 'jotai';
import { allProjectsAtom, paginatedProjectsAtom, currentPageAtom, hasMoreProjectsAtom, currentUserAtom, userRegistrationStatusAtom } from '@/lib/atoms';

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

export default function ProjectsListingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | 'remote' | 'onsite'>('all');
  const [rateSortOrder, setRateSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [durationSortOrder, setDurationSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Jotai atoms
  const [allProjects, setAllProjects] = useAtom(allProjectsAtom);
  const [paginatedProjects] = useAtom(paginatedProjectsAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [hasMoreProjects] = useAtom(hasMoreProjectsAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [registrationStatus] = useAtom(userRegistrationStatusAtom);

  // Local state for filtered projects
  const [filteredProjects, setFilteredProjects] = useState<FullProjectData[]>([]);

  // Fetch projects from API only once
  useEffect(() => {
    const fetchProjects = async () => {
      // If we already have projects in the atom, don't fetch again
      if (allProjects.length > 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/projects');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setAllProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [allProjects.length, setAllProjects]);

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(allProjects.map(p => p.metadata.category)))];

  // Apply filters and search to paginated projects
  useEffect(() => {
    let result = [...paginatedProjects];

    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(project =>
        project.project.title.toLowerCase().includes(lowerSearch) ||
        project.metadata.description.toLowerCase().includes(lowerSearch) ||
        project.metadata.requiredSkills.some(skill => skill.toLowerCase().includes(lowerSearch)) ||
        project.metadata.location.toLowerCase().includes(lowerSearch) ||
        project.metadata.company?.toLowerCase().includes(lowerSearch)
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
        const isRemote = project.metadata.location.toLowerCase().includes('remote');
        if (locationFilter === 'remote') return isRemote;
        if (locationFilter === 'onsite') return !isRemote;
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
  }, [paginatedProjects, searchTerm, statusFilter, categoryFilter, locationFilter, rateSortOrder, durationSortOrder]);

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const tsInMs = timestamp * 1000; // convert seconds to milliseconds
    const diff = now - tsInMs;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 9,
    }).format(amount / 1e9);
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

  const loadMoreProjects = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 500);
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
                    placeholder="Search projects by title, skills, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-0 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  {registrationStatus.role === 'manager' && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push('/projects/create-project')}
                      className="flex items-center cursor-pointer gap-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors"
                    >
                      <Plus size={18} />
                      <span>Create Project</span>
                    </motion.button>
                  )}
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
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Stats */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredProjects.length} of {allProjects.length} projects
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${statusFilter === 'open'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Open</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'in-progress' ? 'all' : 'in-progress')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${statusFilter === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">In Progress</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${statusFilter === 'completed'
                    ? 'bg-gray-100 dark:bg-gray-800'
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
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
            >
              <Grid size={20} />
            </button>
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div variants={itemVariants} className="p-12 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Loading projects...</h3>
          </motion.div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <motion.div variants={itemVariants} className="p-12 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Error loading projects</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </motion.div>
        )}

        {/* Projects Grid/List */}
        {!isLoading && !error && (
          <motion.div variants={itemVariants} className={`grid ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
            } gap-4`}>
            {filteredProjects.map((projectData) => (
              <Link href={`/projects/${projectData.project.index}`} key={projectData.project.index}>
                <Card className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'
                  } rounded-xl overflow-hidden bg-white dark:bg-gray-950 py-0 gap-2 border-gray-200 dark:border-gray-800 hover:ring-2 hover:ring-purple-500 dark:hover:ring-purple-400 transition-all duration-200 h-full group`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full'
                    }`}>
                    <Image
                      src={projectData.metadata.projectImage || "/api/placeholder/400/200"}
                      width={400}
                      height={200}
                      alt={projectData.project.title}
                      className={`${viewMode === 'list' ? 'h-full' : 'h-32'
                        } w-full object-cover transition-transform duration-300 group-hover:scale-105`}
                    />
                    <div className="absolute bottom-0 right-0 p-2">
                      <StatusBadge status={projectData.project.status} />
                    </div>
                    
                  </div>

                  <CardContent className={`p-4 flex-grow flex flex-col ${viewMode === 'list' ? 'w-2/3' : ''
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {projectData.project.title}
                      </h3>
                      <div className="text-purple-600 dark:text-purple-400 font-bold flex justify-center gap-2
                       whitespace-nowrap">
                        <Hexagon />
                        {formattedAmount(projectData.project.daily_rate)} DLT
                        /day
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {projectData.metadata.description}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {projectData.metadata.requiredSkills.slice(0, 2).map((skill, idx) => (
                        <Badge key={idx} className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                          {skill}
                        </Badge>
                      ))}
                      {projectData.metadata.requiredSkills.length > 2 && (
                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          +{projectData.metadata.requiredSkills.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-2 px-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-purple-500" />
                          <span>{projectData.project.duration_days} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-purple-500" />
                          <span>{projectData.project.labour_count}/{projectData.project.max_labourers}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {formatRelativeTime(projectData.project.timestamp)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <motion.div variants={itemVariants} className="p-12 text-center">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Load More Button - uses Jotai for pagination */}
        {!isLoading && !error && filteredProjects.length > 0 && hasMoreProjects && (
          <motion.div variants={itemVariants} className="flex justify-center mt-8">
            <Button
              onClick={loadMoreProjects}
              className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More Projects'
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}