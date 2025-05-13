'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  User, Briefcase, Star, Clock, Globe, Calendar, 
  DollarSign, Award, Book, Mail, Link, MapPin, 
  Smartphone, Languages, CheckCircle, PieChart, UserCheck,
  Building, Users, ChartBar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole, FullUserData, LaborMetadata, ManagerMetadata } from '@/types/user';

export default function UserDashboard({ userData }: { userData: FullUserData }) {
  const { account, metadata } = userData;
  const isLabor = account.role === UserRole.Labour;
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Render labor-specific content
  const renderLaborContent = () => {
    const laborMetadata = metadata as LaborMetadata;
    return (
      <>
        {/* Statistics Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profile Strength</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">85%</h3>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Progress value={85} className="h-1 mt-4 bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
              </Progress>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed Projects</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{laborMetadata.workHistory?.length || 0}</h3>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{laborMetadata.skillsets?.length || 0}</h3>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Book className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Certifications</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{laborMetadata.certifications?.length || 0}</h3>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <TabsTrigger value="skills" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Skills & Experience
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Work History
              </TabsTrigger>
              <TabsTrigger value="certifications" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Certifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <UserCheck className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Skills</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Technical expertise and competencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {laborMetadata.skillsets?.map((skill, index) => (
                        <Badge key={index} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <Briefcase className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Experience</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Professional background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {laborMetadata.experience?.map((exp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4">
              <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <PieChart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>Work History</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Past work and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {laborMetadata.workHistory?.map((work, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{work.title}</h3>
                          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/10 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                            {work.duration}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{work.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certifications" className="mt-4">
              <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Award className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>Certifications & Qualifications</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Professional credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {laborMetadata.certifications?.map((cert, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{cert}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Verified credential</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </>
    );
  };

  // Render manager-specific content
  const renderManagerContent = () => {
    const managerMetadata = metadata as ManagerMetadata;
    return (
      <>
        {/* Statistics Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Company Profile</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Complete</h3>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Progress value={100} className="h-1 mt-4 bg-gray-200 dark:bg-gray-800">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
              </Progress>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Management Experience</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{managerMetadata.managementExperience || 0} years</h3>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Industry</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{managerMetadata.companyDetails?.industryFocus?.length || 0}</h3>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <ChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Company Established</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {managerMetadata.companyDetails?.founded ? new Date().getFullYear() - managerMetadata.companyDetails.founded : 0} years ago
                  </h3>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <TabsTrigger value="company" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Company Details
              </TabsTrigger>
              <TabsTrigger value="management" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Management Experience
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-200">
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="company" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <Building className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Company Information</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Business details and focus areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Company Name</span>
                      <span className="text-gray-900 dark:text-gray-200">{managerMetadata.companyDetails?.companyName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Industry</span>
                      <span className="text-gray-900 dark:text-gray-200">{managerMetadata.companyDetails?.industry}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Location</span>
                      <span className="text-gray-900 dark:text-gray-200">{managerMetadata.companyDetails?.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Founded</span>
                      <span className="text-gray-900 dark:text-gray-200">{managerMetadata.companyDetails?.founded}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <ChartBar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Industry Focus</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Areas of expertise and specialization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      {managerMetadata.companyDetails?.industryFocus || 'No industry focus specified'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="management" className="mt-4">
              <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>Management Experience</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Leadership and management background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Years of Experience</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{managerMetadata.managementExperience} years in management</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Book className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>Company Documents</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Verification and relevant documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {managerMetadata.verificationDocuments && (
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Verification Documents</h3>
                        <p className="text-gray-600 dark:text-gray-400">{managerMetadata.verificationDocuments}</p>
                      </div>
                    )}
                    {managerMetadata.relevantDocuments && (
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Relevant Documents</h3>
                        <p className="text-gray-600 dark:text-gray-400">{managerMetadata.relevantDocuments}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </>
    );
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
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 items-start">
          <Card className="flex-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-purple-500">
                    <AvatarImage src={metadata.profileImage || ""} alt={metadata.name} />
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-xl">
                      {metadata.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {account.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{metadata.name}</h1>
                    <Badge variant="outline" className={`
                      ${isLabor ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'}
                    `}>
                      {isLabor ? 'Labor' : 'Manager'}
                    </Badge>
                    {account.active && (
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {isLabor 
                          ? `${(metadata as LaborMetadata).city}, ${(metadata as LaborMetadata).state}`
                          : (metadata as ManagerMetadata).companyDetails?.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Joined {formatDate(account.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">{metadata.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Link className="mr-2 h-4 w-4" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full lg:w-72 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Rating & Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Overall Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-900 dark:text-white font-medium ml-1">{account.rating.toFixed(1)}</span>
                  </div>
                </div>
                <Progress value={(account.rating / 5) * 100} className="bg-gray-200 dark:bg-gray-800 h-2">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" />
                </Progress>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on {account.rating_count} reviews</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role-specific content */}
        {isLabor ? renderLaborContent() : renderManagerContent()}
      </motion.div>
    </div>
  );
}