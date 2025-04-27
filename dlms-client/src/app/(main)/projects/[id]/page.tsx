'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, Users, Tag, ArrowUpRight, Briefcase, MapPin, Globe, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MOCK_PROJECTS } from '@/lib/DummyData';
import { FullProjectData, ProjectStatus } from '@/types/project';

export default function ProjectDetailsPage() {
  const params = useParams();
  const [project, setProject] = useState<FullProjectData | null>(null);

  useEffect(() => {
    const projectId = parseInt(params.id as string);
    const foundProject = MOCK_PROJECTS.find(p => p.project.index === projectId);
    setProject(foundProject || null);
  }, [params.id]);

  if (!project) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Project not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The project you're looking for doesn't exist or has been removed.</p>
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
                    {project.metadata.managerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{project.metadata.managerName}</p>
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
              <Button className="w-full">
                Apply for this Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 