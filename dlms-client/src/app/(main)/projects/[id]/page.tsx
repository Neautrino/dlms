'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, Users, Tag, ArrowUpRight, Briefcase, MapPin, Globe, Building2, FileText, CheckCircle2, User, Check, X, Hexagon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FullProjectData, ProjectStatus } from '@/types/project';
import { ApplicationStatus } from '@/types/application';
import ApplyToProjectForm from '@/components/ApplyToProjectForm';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAtom } from 'jotai';
import { allProjectsAtom } from '@/lib/atoms';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useUserData } from '@/hooks/use-user-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import bs58 from 'bs58';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey, signTransaction } = useWallet();
  const { user, registrationStatus } = useUserData();
  const [project, setProject] = useState<FullProjectData | null>(null);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const { toast } = useToast();
  const [allProjects, setAllProjects] = useAtom(allProjectsAtom);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const { connection } = useConnection();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const projectId = parseInt(params.id as string);
        
        // First check if the project exists in allProjects atom
        if (allProjects.length > 0) {
          const foundProject = allProjects.find((p: FullProjectData) => p.project.index === projectId);
          if (foundProject) {
            setProject(foundProject);
            setIsLoading(false);
            return;
          }
        }
        
        // If not found in atom, fetch from API
        const response = await axios.get('/api/projects');
        
        if(response.status !== 200) {
          throw new Error('Failed to fetch projects');
        }
        
        const projects = await response.data;
        setAllProjects(projects);
        
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
  }, [params.id, allProjects]);

  // Add new useEffect to fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      console.log("Project", project);
      console.log("CUrrent user", user);
      console.log("status", registrationStatus.role)
      if (!project || !user || registrationStatus.role !== 'manager') return;
      
      try {
        setIsLoadingApplications(true);
        const response = await axios.post(`/api/get-application-by-project`, {
          projectPubkey: project.project.publicKey,
        });
        console.log("Application Responce:", response );  
        if (response.status !== 200) throw new Error('Failed to fetch applications');
        const data = response.data;
        console.log("Fetching applications", data);
        setApplications(data?.applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast('error', {
          title: "Error",
          description: "Failed to load applications"
        });
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [project, user, registrationStatus.role]);

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

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 9,
    }).format(amount / 1e9);
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

  const handleApproveApplication = async (applicationPda: string, labourAccountPda: string) => {
    if (!publicKey || !project || !signTransaction) return;

    try {
      const response = await axios.post('/api/approve-application', {
        walletAddress: publicKey.toString(),
        applicationPda,
        projectPda: project.project.publicKey,
        labourAccountPda
      });

      if (response.status !== 200) {
        throw new Error('Failed to approve application');
      }

      const data = response.data;
      
      // Sign and send transaction
     // Deserialize and sign the transaction
     const transaction = Transaction.from(bs58.decode(data.serializedTransaction));
     transaction.recentBlockhash = data.blockhash;
     transaction.lastValidBlockHeight = data.lastValidBlockHeight;
     transaction.feePayer = publicKey;

     const signedTx = await signTransaction(transaction);
     
     // Send the transaction
     const signature = await connection.sendRawTransaction(signedTx.serialize());
     
     // Wait for confirmation
     await connection.confirmTransaction({
       signature,
       blockhash: data.blockhash,
       lastValidBlockHeight: data.lastValidBlockHeight,
     });
      
      toast('success', {
        title: "Success",
        description: "Application approved successfully"
      });
      
      // Refresh applications
      const appsResponse = await axios.post(`/api/get-application-by-project`, {
        projectPubkey: project.project.publicKey,
      });
      setApplications(appsResponse.data.applications);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
      toast('error', {
        title: "Error",
        description: "Failed to approve application"
      });
    }
  };

  function ApplicationDetailsDialog({ 
    application, 
    isOpen, 
    onClose, 
    onApprove 
  }: { 
    application: any, 
    isOpen: boolean, 
    onClose: () => void,
    onApprove: (applicationPda: string, labourAccountPda: string) => void 
  }) {
    if (!application) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">Application Details</DialogTitle>
            <div className="h-1 w-20 bg-purple-500 rounded-full"></div>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Applicant Info Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <User size={40} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-xl text-gray-900 dark:text-white">
                    {application.labour ? `${application.labour.slice(0, 6)}...${application.labour.slice(-6)}` : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Applied {application.timestamp ? formatRelativeTime(application.timestamp) : 'Recently'}
                  </p>
                </div>
                {application.status && 'pending' in application.status && (
                  <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 text-sm">
                    Pending Review
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {application.description}
                </p>
              </div>

              {/* Skills Card */}
              {application.skills && application.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-500" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill: string, idx: number) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="px-4 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Card */}
              {application.experience && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                    Experience
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {application.experience}
                  </p>
                </div>
              )}

              {/* Availability Card */}
              {application.availability && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Availability
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {application.availability}
                  </p>
                </div>
              )}
            </div>

            {/* Approve Button */}
            {application.status && 'pending' in application.status && (
              <div className="pt-6">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => onApprove(application.publicKey, application.labour)}
                >
                  <Check className="w-6 h-6 mr-2" />
                  Approve Application
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                  <div className="text-purple-600 dark:text-purple-400 font-bold flex justify-center gap-2
                       whitespace-nowrap">
                        <Hexagon />
                        {formattedAmount(project.project.daily_rate)} DLT
                        /day
                      </div>
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
                  <a 
                    href={project.metadata.relevant_documents.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <FileText size={20} className="text-purple-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{project.metadata.relevant_documents.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{project.metadata.relevant_documents.uri}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 flex-shrink-0" />
                  </a>
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
                <p className="font-medium text-gray-900 dark:text-white">{project.metadata.company}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 px-3 py-1">
                    <Tag size={14} className="text-purple-500" />
                    {project.metadata.category}
                  </Badge>
                </div>
              </div>
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                <p className="text-gray-900 dark:text-white">{project.metadata.companyDetails.description}</p>
              </div> */}
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
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400">Rating: {project.metadata.managerRating}/5</p> */}
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">Applications</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.project.applications_count || 0} applied
                  </span>
                </div>
                <Progress value={((project.project.applications_count || 0) / project.project.max_labourers) * 100} />
              </div>
              {registrationStatus.role === 'manager' ? null : !publicKey ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled
                >
                  Connect Wallet to Apply
                </Button>
              ) : !user ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled
                >
                  Register to Apply
                </Button>
              ) : registrationStatus.role === 'labour' && user.account.publicKey !== project.metadata.managerWalletAddress ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setIsApplyFormOpen(true)}
                >
                  Apply for this Project
                </Button>
              ) : null}
            </CardContent>
          </Card>

          {/* Applications Section - Only visible to managers */}
          {registrationStatus.role === 'manager' && project && (
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingApplications ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No applications</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div 
                        key={app.publicKey} 
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <User size={20} className="text-purple-800 dark:text-purple-200" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {app.labour ? `${app.labour.slice(0, 6)}...${app.labour.slice(-6)}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Applied {app.timestamp ? formatRelativeTime(app.timestamp) : 'Recently'}
                              </p>
                            </div>
                          </div>
                          {app.status && 'pending' in app.status && (
                            <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Apply Form Popup */}
      <ApplyToProjectForm
        isOpen={isApplyFormOpen}
        onClose={() => setIsApplyFormOpen(false)}
        projectPublicKey={project.project.publicKey}
      />

      {/* Add the ApplicationDetailsDialog component */}
      {project && (
        <ApplicationDetailsDialog
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApproveApplication}
        />
      )}
    </div>
  );
} 