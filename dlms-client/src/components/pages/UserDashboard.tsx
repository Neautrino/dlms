'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  User, Briefcase, Star, Clock, Globe, Calendar, 
  DollarSign, Award, Book, Mail, Link, MapPin, 
  Smartphone, Languages, CheckCircle, PieChart, UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole, FullUserData } from '@/types/user';

// Mock data for demonstration
const mockUserData: FullUserData = {
  account: {
    authority: '0x1a2b3c4d5e6f7g8h9i0j',
    name: 'Alex Johnson',
    metadata_uri: 'ipfs://Qm12345abcdef',
    active: true,
    verified: true,
    rating: 4.8,
    rating_count: 56,
    timestamp: 1682547600,
    index: 12,
    role: UserRole.Labor,
    spam: false
  },
  metadata: {
    name: 'Alex Johnson',
    bio: 'Experienced blockchain developer with a passion for DeFi and web3 technologies. I specialize in creating secure smart contracts and intuitive user interfaces.',
    profileImage: '/avatars/01.png',
    age: 28,
    experience: ['Smart Contract Development', 'React Frontend', 'DeFi Protocol Design'],
    skillsets: ['Solidity', 'React', 'TypeScript', 'Ethers.js', 'Hardhat', 'Web3.js'],
    availability: 'Available for Work',
    hourlyRate: 120,
    preferredLocation: 'Remote',
    languages: ['English', 'Spanish', 'Russian'],
    certifications: ['Certified Blockchain Developer', 'AWS Certified Solutions Architect'],
    projectHistory: [
      {
        title: 'DeFi Lending Platform',
        description: 'Developed smart contracts for a decentralized lending protocol with variable interest rates.',
        duration: 'May 2023 - August 2023'
      },
      {
        title: 'NFT Marketplace',
        description: 'Built a full-stack NFT marketplace with custom royalty distribution features.',
        duration: 'January 2023 - April 2023'
      },
      {
        title: 'DAO Governance System',
        description: 'Implemented an on-chain governance system for a decentralized autonomous organization.',
        duration: 'October 2022 - December 2022'
      }
    ]
  }
};

export default function UserDashboard() {
  const [userData] = useState<FullUserData>(mockUserData);
  const { account, metadata } = userData;
  
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
                      ${account.role === UserRole.Labor ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'}
                    `}>
                      {account.role === UserRole.Labor ? 'Labor' : 'Manager'}
                    </Badge>
                    {account.active && (
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                        {metadata.availability}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{metadata.preferredLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{metadata.hourlyRate} DLT/hr</span>
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
              
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Certifications</span>
                  </div>
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{metadata.certifications?.length || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Projects</span>
                  </div>
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{metadata.projectHistory?.length || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Languages</span>
                  </div>
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{metadata.languages?.length || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metadata.projectHistory?.length || 0}</h3>
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metadata.skillsets?.length || 0}</h3>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wallet Balance</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1234 DLT</h3>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
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
                Project History
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
                      {metadata.skillsets?.map((skill, index) => (
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
                      {metadata.experience?.map((exp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <Globe className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Languages</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Communication capabilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {metadata.languages?.map((language, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300">{language}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                      <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                      <span>Availability</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Current work status and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Status</span>
                      <Badge className={`
                        ${account.active ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'}
                      `}>
                        {account.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Location</span>
                      <span className="text-gray-900 dark:text-gray-200">{metadata.preferredLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Rate</span>
                      <span className="text-gray-900 dark:text-gray-200">{metadata.hourlyRate} DLT/hour</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4">
              <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <PieChart className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>Project History</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Past work and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {metadata.projectHistory?.map((project, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.title}</h3>
                          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/10 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                            {project.duration}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
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
                    {metadata.certifications?.map((cert, index) => (
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
        
        
      </motion.div>
    </div>
  );
}