'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, CheckCircle, Clock, AlertCircle, Building, Users } from 'lucide-react';
import { formatRelativeTime } from '@/utils/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/user';
import { useUserData } from '@/hooks/use-user-data';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58  from "bs58";
import { connection } from '@/utils/program';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Application {
  publicKey: string;
  project: string;
  description: string;
  skills: string[];
  experience: string;
  availability: string;
  status: any;
  timestamp: number;
}

interface WorkVerification {
  publicKey: string;
  project: string;
  labour: string;
  day_number: number;
  manager_verified: boolean;
  labour_verified: boolean;
  metadata_uri: string;
  timestamp: string;
  payment_processed: boolean;
}

interface Assignment {
  publicKey: string;
  project: string;
  labour: string;
  daysWorked: number;
  daysPaid: number;
  active: boolean;
  timestamp: number;
  verifications: WorkVerification[];
  verificationStatus: {
    total: number;
    verified: number;
    pending: number;
  };
}

export default function ProfilePage() {
  const { publicKey, signTransaction } = useWallet();
  const { user, registrationStatus, isLoading: isLoadingUser } = useUserData();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [workVerifications, setWorkVerifications] = useState<WorkVerification[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isWorkSubmissionOpen, setIsWorkSubmissionOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [nextDayPlan, setNextDayPlan] = useState('');
  const [workImages, setWorkImages] = useState<File[]>([]);
  const [supportingDocuments, setSupportingDocuments] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey && registrationStatus.role === 'labour') {  
      fetchApplications();  
      fetchWorkVerifications();
      fetchAssignments();
    } else if (publicKey && registrationStatus.role === 'manager') {
      fetchAssignments();
      fetchWorkVerifications();
    }
  }, [publicKey, registrationStatus.role]);

  const fetchAssignments = async () => {
    setIsLoadingAssignments(true);
    try {
      const response = await axios.post('/api/get-assignments-by-labour', {
        labourPubkey: user?.account.publicKey ? new PublicKey(user.account.publicKey).toBase58() : '',
      });

      setAssignments(response.data.assignments);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while fetching assignments';
      
      setError(errorMessage);
      toast('error', {
        title: 'Error',
        description: errorMessage,
      });
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const fetchApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const response = await fetch('/api/get-applications-by-labour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labourPubkey: user?.account.publicKey ? new PublicKey(user.account.publicKey).toBase58() : '',
        }),
      });
      const data = await response.json();
      console.log("Users applications: ", data);
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const fetchWorkVerifications = async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    setIsLoadingVerifications(true);
    setError(null);

    try {
      const managerPubkey = new PublicKey(user?.account.publicKey as string)
      console.log("sending", managerPubkey);
      const response = await axios.post<{
        success: boolean;
        workVerifications: WorkVerification[];
        error?: string;
      }>('/api/get-work-verification-by-manager', {
        managerPubkey
      });

      console.log(response.data)

      if (response.data) {
        console.log(response.data.workVerifications)
        setWorkVerifications(response.data.workVerifications);
      } else {
        throw new Error('Failed to fetch work verifications');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while fetching work verifications';
      
      setError(errorMessage);
      toast('error', {
        title: 'Error',
        description: errorMessage,
      });
      console.error('Error fetching work verifications:', error);
    } finally {
      setIsLoadingVerifications(false);
    }
  };

  const handleWorkSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !publicKey) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Log the values before appending
      console.log("Values to be sent:", {
        walletAddress: publicKey.toBase58(),
        projectPda: selectedProject,
        dayNumber: ((assignments.find(a => a.project === selectedProject)?.daysWorked || 0) + 1).toString(),
        description,
        hoursWorked,
        tasksCompleted,
        challengesFaced,
        nextDayPlan,
        workImages: workImages.length,
        supportingDocuments: supportingDocuments ? 'present' : 'none'
      });

      // Append all required fields
      formData.append('walletAddress', publicKey.toBase58());
      formData.append('projectPda', selectedProject);
      formData.append('dayNumber', ((assignments.find(a => a.project === selectedProject)?.daysWorked || 0) + 1).toString());
      formData.append('description', description);
      formData.append('hoursWorked', hoursWorked);
      formData.append('tasksCompleted', tasksCompleted);
      
      // Append optional fields if they exist
      if (challengesFaced) {
        formData.append('challengesFaced', challengesFaced);
      }
      if (nextDayPlan) {
        formData.append('nextDayPlan', nextDayPlan);
      }
      
      // Append work images
      workImages.forEach((file, index) => {
        formData.append(`workImages`, file);
      });

      // Append supporting documents if exists
      if (supportingDocuments) {
        formData.append('supportingDocuments', supportingDocuments);
      }

      const response = await fetch('/api/verify-work-day', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit work');
      }

      const transaction = Transaction.from(bs58.decode(data.serializedTransaction));
      transaction.recentBlockhash = data.blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction with the user's wallet
      if (!signTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }

      console.log('Signing transaction...');
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction to the network
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      // Optionally, confirm the transaction
      await connection.confirmTransaction(txid);

      console.log('Transaction sent and confirmed:', txid);

      toast('success', {
        title: "Submitted workday",
        description: "Your work day submitted successfully!",
        duration: 3000,
        position: 'bottom-right',
        icon: '🎉'
      });
      
      // Reset form
      setDescription('');
      setHoursWorked('');
      setTasksCompleted('');
      setChallengesFaced('');
      setNextDayPlan('');
      setWorkImages([]);
      setSupportingDocuments(null);
      setIsWorkSubmissionOpen(false);
      
      // Refresh assignments to show updated days worked
      fetchAssignments();
    } catch (error) {
      console.error('Error submitting work:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveWork = async (workVerification: WorkVerification) => {
    if (!publicKey || !signTransaction) {
      toast('error', {
        title: 'Error',
        description: 'Wallet not connected or does not support transaction signing',
      });
      return;
    }

    try {
      const response = await axios.post('/api/approve-work-day', {
        walletAddress: publicKey.toBase58(),
        managerPda: user?.account.publicKey,
        projectPda: workVerification.project,
        labourPda: workVerification.labour,
        dayNumber: workVerification.day_number,
      });

      console.log(response.data);

      if (!response.data) {
        throw new Error('Failed to create approve work transaction');
      }

      const data = response.data

      const transaction = Transaction.from(bs58.decode(data.serializedTransaction));
      transaction.recentBlockhash = data.blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction with the user's wallet
      if (!signTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }

      console.log('Signing transaction...');
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction to the network
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      // Optionally, confirm the transaction
      await connection.confirmTransaction(txid);

      console.log('Transaction sent and confirmed:', txid);

      toast('success', {
        title: 'Work Approved',
        description: 'The work has been successfully approved!',
      });

      // Refresh the data
      fetchWorkVerifications();
      fetchAssignments();
    } catch (error) {
      console.error('Error approving work:', error);
      toast('error', {
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve work',
      });
    }
  };

  if (!publicKey) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please connect your wallet to view your profile</h1>
      </div>
    );
  }

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!registrationStatus.isRegistered) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please register to view your profile</h1>
      </div>
    );
  }

  if (registrationStatus.role === 'manager') {
    return (
      <div className="container mx-auto py-8">
        {isLoadingVerifications ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading verifications...</p>
          </div>
        ) : !workVerifications || workVerifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No work verifications found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Verifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
              <div className="grid gap-4">
                {workVerifications
                  .filter(work => work && typeof work.manager_verified === 'boolean' && !work.manager_verified)
                  .map(work => (
                    <Card key={work.publicKey}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Day {work.day_number}</CardTitle>
                            <CardDescription>
                              Submitted {formatRelativeTime(parseInt(work.timestamp))}
                            </CardDescription>
                          </div>
                          <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{work.project}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Labour</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{work.labour}</p>
                          </div>
                          <Button
                            onClick={() => handleApproveWork(work)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Approve Work
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Completed Verifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Verifications</h2>
              <div className="grid gap-4">
                {workVerifications
                  .filter(work => work.manager_verified)
                  .map(work => (
                    <Card key={work.publicKey}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Day {work.day_number}</CardTitle>
                            <CardDescription>
                              Submitted {formatRelativeTime(parseInt(work.timestamp))}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                            Verified
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{work.project}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Labour</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">{work.labour}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</h3>
                            <p className="mt-1 text-gray-900 dark:text-white">
                              {work.payment_processed ? 'Paid' : 'Pending Payment'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {isLoadingAssignments ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      ) : assignments.filter(a => a.active).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No active assignments found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {assignments.filter(a => a.active).map((assignment) => (
            <Card key={assignment.publicKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Users size={20} className="text-blue-800 dark:text-blue-200" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Project Assignment</CardTitle>
                      <CardDescription>
                        Created {formatRelativeTime(assignment.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{assignment.project}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Worked</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{assignment.daysWorked}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Paid</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">{assignment.daysPaid}</p>
                    </div>
                  </div>
                  
                  {/* Verification Status */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Verification Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Days</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {assignment.verificationStatus.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {assignment.verificationStatus.verified}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                        <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          {assignment.verificationStatus.pending}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Verifications */}
                  {assignment.verifications.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Verifications</h3>
                      <div className="space-y-2">
                        {assignment.verifications.slice(0, 3).map((verification) => (
                          <div
                            key={verification.publicKey}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">Day {verification.day_number}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(parseInt(verification.timestamp))}
                              </p>
                            </div>
                            <Badge
                              className={
                                verification.manager_verified && verification.labour_verified
                                  ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                  : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                              }
                            >
                              {verification.manager_verified && verification.labour_verified
                                ? "Verified"
                                : "Pending"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedProject(assignment.project);
                      setIsWorkSubmissionOpen(true);
                    }}
                  >
                    Submit Work
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Work Submission Dialog */}
      <Dialog open={isWorkSubmissionOpen} onOpenChange={setIsWorkSubmissionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Work</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleWorkSubmission} className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe the work you completed today..."
              />
            </div>
            <div>
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                required
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="tasksCompleted">Tasks Completed</Label>
              <Textarea
                id="tasksCompleted"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                required
                placeholder="List the tasks you completed (comma-separated)..."
              />
            </div>
            <div>
              <Label htmlFor="challengesFaced">Challenges Faced (Optional)</Label>
              <Textarea
                id="challengesFaced"
                value={challengesFaced}
                onChange={(e) => setChallengesFaced(e.target.value)}
                placeholder="Describe any challenges you faced..."
              />
            </div>
            <div>
              <Label htmlFor="nextDayPlan">Next Day Plan (Optional)</Label>
              <Textarea
                id="nextDayPlan"
                value={nextDayPlan}
                onChange={(e) => setNextDayPlan(e.target.value)}
                placeholder="What are your plans for tomorrow?"
              />
            </div>
            <div>
              <Label htmlFor="workImages">Work Images (Optional)</Label>
              <Input
                id="workImages"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setWorkImages(Array.from(e.target.files));
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="supportingDocuments">Supporting Documents (Optional)</Label>
              <Input
                id="supportingDocuments"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSupportingDocuments(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWorkSubmissionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Work'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
