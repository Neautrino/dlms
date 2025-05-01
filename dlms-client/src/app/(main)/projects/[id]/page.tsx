'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, Users, Tag, ArrowUpRight, Briefcase, MapPin, Globe, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FullProjectData, ProjectStatus } from '@/types/project';
import ApplyToProjectForm from '@/components/ApplyToProjectForm';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/lib/atoms';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey } = useWallet();
  const [project, setProject] = useState<FullProjectData | null>(null);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const projectId = parseInt(params.id as string);
        
        // Fetch all projects from the API
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const projects = await response.json();
        
        // Find the project with the matching index
        const foundProject = projects.find((p: FullProjectData) => p.project.index === projectId);
        
        if (!foundProject) {
          setError('Project not found');
        } else {
          setProject(foundProject);
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [params.id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Loading project details...</h1>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Project not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {error || "The project you're looking for doesn't exist or has been removed."}
          </p>
          <Button 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days/30)} months ago`;
    return `${Math.floor(days/365)} years ago`;
  };

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <Card className="overflow-hidden">
            <div className="relative h-64">
              <Image
                src={project.metadata.projectImage || '/images/default-project-image.jpg'}
                alt={project.project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={project.project.status} />
                  {project.metadata.companyDetails?.verifiedDocument && (
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Verified Company
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{project.project.title}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Building2 size={16} />
                    <span>{project.metadata.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.metadata.location.toLowerCase().includes('remote') ? (
                      <>
                        <Globe size={16} />
                        <span>Remote</span>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        <span>{project.metadata.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">{project.metadata.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Daily Rate</h3>
                  <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    {formatCurrency(project.project.daily_rate)}/day
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.project.duration_days} days
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.metadata.startDate ? new Date(project.metadata.startDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Application Deadline</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.metadata.application_deadline ? new Date(project.metadata.application_deadline).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.metadata.requiredSkills.map((skill, idx) => (
                    <Badge key={idx} className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project Documents</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <FileText size={20} className="text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{project.metadata.relevant_documents.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.metadata.relevant_documents.uri}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company</h3>
                <p className="font-medium text-gray-900 dark:text-white">{project.metadata.companyDetails.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Industry Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {project.metadata.companyDetails.industryFocus.map((focus, idx) => (
                    <Badge key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                <p className="text-gray-900 dark:text-white">{project.metadata.companyDetails.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Project Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-lg font-medium text-purple-800 dark:text-purple-200">
                    <Users size={24} />
                  </span>
                </div>
                <div>
                  <button 
                    onClick={() => router.push(`/users/${project.metadata.managerWalletAddress}`)}
                    className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {project.metadata.managerWalletAddress.slice(0, 6)}...{project.metadata.managerWalletAddress.slice(-6)}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating: {project.metadata.managerRating}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Hired Laborers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.project.labour_count}/{project.project.max_labourers}
                  </span>
                </div>
                <Progress value={(project.project.labour_count / project.project.max_labourers) * 100} />
              </div>
              {!publicKey ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled
                >
                  Connect Wallet to Apply
                </Button>
              ) : !currentUser ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled
                >
                  Register to Apply
                </Button>
              ) : (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setIsApplyFormOpen(true)}
                >
                  Apply for this Project
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Form Popup */}
      <ApplyToProjectForm
        isOpen={isApplyFormOpen}
        onClose={() => setIsApplyFormOpen(false)}
        projectPublicKey={project.project.publicKey}
      />
    </div>
  );
} 