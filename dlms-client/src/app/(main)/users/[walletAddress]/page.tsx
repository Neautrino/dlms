'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserCheck, Star, Briefcase, CalendarClock, Tag, MessageSquare, ArrowLeft, MapPin, FileText, Code, Globe, Award, Cake, User } from 'lucide-react';
import Image from 'next/image';
import { FullUserData, UserRole, LaborMetadata, ManagerMetadata, getTypedUserData } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAtom } from 'jotai';
import { userAtom, currentUserAtom, allProjectsAtom } from '@/lib/atoms';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FullProjectData } from '@/types/project';
import RateUserPopup from '@/components/RateUserPopup';

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<FullUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUsers] = useAtom(userAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const [allProjects] = useAtom(allProjectsAtom);
  const [userProjects, setUserProjects] = useState<FullProjectData[]>([]);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  
  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const walletAddress = params.walletAddress?.toString() || '';

      // First check if the user is the current user
      if (currentUser && currentUser.account.authority === walletAddress) {
        setUser(currentUser); 
        setIsLoading(false);
        return;
      }

      // Then check if the user exists in the allUsers atom
      if (allUsers) {
        const foundUser = allUsers.find(u => u.account.authority === walletAddress);
        if (foundUser) {
          setUser(foundUser);
          setIsLoading(false);
          return;
        }
      }

      // If not found in atoms, fetch from API
      const response = await fetch('/api/get-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const userData = await response.json();

      if (userData.exists && userData.user) {
        console.log("User data:", userData.user);
        setUser(userData.user);
      } else {
        setError('User not found');
      }
    
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to load user details. Please try again later.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.walletAddress) {
      fetchUserDetails();
    }
  }, [params.walletAddress, allUsers, currentUser]);

  useEffect(() => {
    // Filter projects based on user role
    if (user && allProjects) {
      if (user.account.role === UserRole.Manager) {
        // For managers, find projects where they are the manager
        const managerProjects = allProjects.filter(
          project => project.project.manager === user.account.authority
        );
        setUserProjects(managerProjects);
      } else {
        // For laborers, we would need to check if they are assigned to projects
        // This would require additional data that might not be available in the current structure
        // For now, we'll just set an empty array
        setUserProjects([]);
      }
    }
  }, [user, allProjects]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRating = (rating: number, count: number) => {
    const average = count > 0 ? (rating / count / 10).toFixed(1) : '0.0';
    return `${average} (${count} reviews)`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-gray-500 dark:text-gray-400 mb-4">User not found</div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const typedUser = getTypedUserData(user);
  const isLabor = user.account.role === UserRole.Labour;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-24" />
            <CardContent className="pt-0 relative">
              <div className="flex justify-center -mt-12">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 rounded-full">
                  <AvatarImage 
                    src={user.metadata.profileImage || "/api/placeholder/80/80"} 
                    alt={user.account.name} 
                  />
                  <AvatarFallback>{user.account.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center mt-4">
                <h1 className="text-xl font-bold tracking-tight">{user.account.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isLabor ? "Labor Professional" : "Project Manager"}
                </p>
                
                <div className="flex justify-center gap-2 mt-3">
                  <Badge variant={user.account.verified ? "default" : "secondary"} className="px-2 py-0.5">
                    {user.account.verified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge variant={user.account.active ? "default" : "destructive"} className="px-2 py-0.5">
                    {user.account.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center gap-1 mt-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{formatRating(user.account.rating, user.account.rating_count)}</span>
                </div>

                {/* Add Rate Button */}
                {currentUser && currentUser.account.authority !== user.account.authority && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={() => setIsRatingPopupOpen(true)}
                      className="w-full max-w-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate User
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {typedUser.metadata.city && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>
                      {[
                        typedUser.metadata.city,
                        typedUser.metadata.state,
                        typedUser.metadata.country
                      ].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <CalendarClock className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Member since {formatTimestamp(user.account.timestamp)}</span>
                </div>
                
                {typedUser.metadata.languages && typedUser.metadata.languages.length > 0 && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{typedUser.metadata.languages.join(", ")}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  {user.metadata.bio || "No bio available"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="skills" className="flex-1">Skills & Experience</TabsTrigger>
              {isLabor && (
                <TabsTrigger value="work" className="flex-1">Work History</TabsTrigger>
              )}
              {!isLabor && (
                <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
              )}
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
                        <p className="font-medium mt-1">{isLabor ? "Labor Professional" : "Project Manager"}</p>
                      </div>
                      
                      {typedUser.metadata.gender && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h3>
                          <div className="flex items-center mt-1">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <p>{typedUser.metadata.gender}</p>
                          </div>
                        </div>
                      )}
                      
                      {typedUser.metadata.dateOfBirth && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</h3>
                          <div className="flex items-center mt-1">
                            <Cake className="h-4 w-4 text-gray-500 mr-2" />
                            <p>
                              {typeof typedUser.metadata.dateOfBirth === 'string' 
                                ? new Date(typedUser.metadata.dateOfBirth).toLocaleDateString() 
                                : typedUser.metadata.dateOfBirth.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {(typedUser.metadata.city || typedUser.metadata.state || typedUser.metadata.country) && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <p>
                              {[
                                typedUser.metadata.city,
                                typedUser.metadata.state,
                                typedUser.metadata.country,
                                typedUser.metadata.postalCode
                              ].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {typedUser.metadata.languages && typedUser.metadata.languages.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Languages</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {typedUser.metadata.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Documents Section */}
                  {(typedUser.metadata.verificationDocuments || typedUser.metadata.relevantDocuments) && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {typedUser.metadata.verificationDocuments && (
                            <a 
                              href={typedUser.metadata.verificationDocuments}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <UserCheck className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-sm font-medium">Verification Documents</h4>
                                <p className="text-xs text-gray-500 truncate">{typedUser.metadata.verificationDocuments}</p>
                              </div>
                            </a>
                          )}
                          {typedUser.metadata.relevantDocuments && (
                            <a 
                              href={typedUser.metadata.relevantDocuments}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-sm font-medium">Relevant Documents</h4>
                                <p className="text-xs text-gray-500 truncate">{typedUser.metadata.relevantDocuments}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Skills & Experience Tab */}
            <TabsContent value="skills" className="mt-0">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    {isLabor ? "Skills & Expertise" : "Management Experience"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLabor && 'skillsets' in typedUser.metadata && typedUser.metadata.skillsets && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {typedUser.metadata.skillsets.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isLabor && 'experience' in typedUser.metadata && typedUser.metadata.experience && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Experience</h3>
                      <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {typedUser.metadata.experience.map((exp, index) => (
                          <li key={index}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {isLabor && 'certifications' in typedUser.metadata && typedUser.metadata.certifications && typedUser.metadata.certifications.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Certifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {typedUser.metadata.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Award className="h-5 w-5 text-indigo-500 mr-3" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!isLabor && 'managementExperience' in typedUser.metadata && typedUser.metadata.managementExperience && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Management Experience</h3>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {typedUser.metadata.managementExperience}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{typedUser.metadata.managementExperience} years</p>
                          <p className="text-sm text-gray-500">of professional management experience</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Projects Section */}
                  {userProjects.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        {isLabor ? "Projects" : "Managed Projects"}
                      </h3>
                      <div className="space-y-4">
                        {userProjects.map((project, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{project.metadata.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {project.metadata.description.substring(0, 100)}
                                  {project.metadata.description.length > 100 ? '...' : ''}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  project.project.status === 0 ? "outline" : 
                                  project.project.status === 1 ? "secondary" : 
                                  project.project.status === 2 ? "default" : "destructive"
                                }
                              >
                                {project.project.status === 0 ? "Open" : 
                                 project.project.status === 1 ? "In Progress" : 
                                 project.project.status === 2 ? "Completed" : "Cancelled"}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.metadata.requiredSkills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <CalendarClock className="h-4 w-4 mr-1" />
                              <span>
                                {project.metadata.startDate 
                                  ? `Started: ${new Date(project.metadata.startDate).toLocaleDateString()}` 
                                  : `Created: ${formatTimestamp(project.project.timestamp)}`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Work History Tab */}
            {isLabor && (
              <TabsContent value="work" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Work History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLabor && 'workHistory' in typedUser.metadata && typedUser.metadata.workHistory && typedUser.metadata.workHistory.length > 0 ? (
                      <div className="space-y-6">
                        {typedUser.metadata.workHistory.map((work, index) => (
                          <div key={index} className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-800">
                            <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                            <div className="mb-1">
                              <h4 className="font-medium text-lg">{work.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{work.duration}</p>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-2">{work.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No work history available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {/* Company Tab */}
            {!isLabor && (
              <TabsContent value="company" className="mt-0">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Company Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!isLabor && 'companyDetails' in typedUser.metadata && typedUser.metadata.companyDetails ? (
                      <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-2">{typedUser.metadata.companyDetails.companyName}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center">
                              <Briefcase className="h-5 w-5 text-indigo-500 mr-3" />
                              <div>
                                <h4 className="text-sm font-medium">Industry</h4>
                                <p className="text-sm text-gray-500">{typedUser.metadata.companyDetails.industry}</p>
                              </div>
                            </div>
                            
                            {typedUser.metadata.companyDetails.founded && (
                              <div className="flex items-center">
                                <CalendarClock className="h-5 w-5 text-indigo-500 mr-3" />
                                <div>
                                  <h4 className="text-sm font-medium">Founded</h4>
                                  <p className="text-sm text-gray-500">{typedUser.metadata.companyDetails.founded}</p>
                                </div>
                              </div>
                            )}
                            
                            {typedUser.metadata.companyDetails.location && (
                              <div className="flex items-center">
                                <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                                <div>
                                  <h4 className="text-sm font-medium">Location</h4>
                                  <p className="text-sm text-gray-500">{typedUser.metadata.companyDetails.location}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {typedUser.metadata.companyDetails.industryFocus && typedUser.metadata.companyDetails.industryFocus.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Industry Focus</h3>
                            <div className="flex flex-wrap gap-2">
                              {typedUser.metadata.companyDetails.industryFocus.map((focus, index) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {focus}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No company details available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Rating Popup */}
      <RateUserPopup
        isOpen={isRatingPopupOpen}
        onClose={() => setIsRatingPopupOpen(false)}
        userName={user.account.name}
        userAddress={user.account.authority}
      />
    </motion.div>
  );
}