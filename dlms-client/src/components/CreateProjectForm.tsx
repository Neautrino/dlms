'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  X, Loader2, Plus, Upload, Briefcase, DollarSign, Calendar, Users, 
  MapPin, Building2, FileText, Tag, ChevronRight, ChevronLeft, CheckCircle, Globe
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { connection } from '@/utils/program';
import bs58 from 'bs58';
import { useRouter } from 'next/navigation';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const COUNTRIES = [
  "India"
];

export default function CreateProjectForm({ onClose }: { onClose: () => void }) {
  const { publicKey, signTransaction } = useWallet();
  const { theme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const isDarkMode = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    dailyRate: string;
    durationDays: string;
    maxLabourers: string;
    country: string;
    state: string;
    requiredSkills: string;
    company: string;
    category: string;
    managerAddress: string;
    startDate: string;
    applicationDeadline: string;
    relevantDocsDescription: string;
    projectImage: File | null;
    relevantDocuments: File[];
  }>({
    title: '',
    description: '',
    dailyRate: '',
    durationDays: '',
    maxLabourers: '',
    country: '',
    state: '',
    requiredSkills: '',
    company: '',
    category: '',
    managerAddress: '',
    startDate: '',
    applicationDeadline: '',
    relevantDocsDescription: '',
    projectImage: null,
    relevantDocuments: []
  });

  const [completedSteps, setCompletedSteps] = useState<{
    [key: number]: boolean;
  }>({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Check if current step is complete
  useEffect(() => {
    const checkStepCompletion = () => {
      switch (currentStep) {
        case 1:
          setCompletedSteps(prev => ({
            ...prev,
            1: !!formData.title && !!formData.description && !!formData.country && !!formData.state
          }));
          break;
        case 2:
          setCompletedSteps(prev => ({
            ...prev,
            2: !!formData.dailyRate && !!formData.durationDays && !!formData.maxLabourers
          }));
          break;
        case 3:
          setCompletedSteps(prev => ({
            ...prev,
            3: !!formData.company && !!formData.requiredSkills && !!formData.category
          }));
          break;
        case 4:
          setCompletedSteps(prev => ({
            ...prev,
            4: true // Always allow submission on last step
          }));
          break;
      }
    };
    
    checkStepCompletion();
  }, [currentStep, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");
    setIsSubmitting(true);
    setError(null);

    try {
      if (!publicKey) {
        throw new Error('Please connect your wallet');
      }

      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (Array.isArray(value)) {
            value.forEach((file) => {
              formDataToSend.append(`relevantDocuments`, file);
            });
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // Add wallet address
      formDataToSend.append('walletAddress', publicKey.toString());

      const response = await fetch('/api/create-project', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create project');
      }

      // Decode the base58 transaction
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

      // Success handling
      toast('success', {
        title: "Project Created",
        description: "Your project has been created successfully!",
        duration: 3000,
        position: 'bottom-right',
        icon: '🎉'
      });
      
      router.push('/projects');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the project';
      setError(errorMessage);
      toast('error', {
        title: "Error",
        description: errorMessage,
        duration: 3000,
        position: 'bottom-right',
        icon: '🚫'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files.length > 0) {
      if (field === 'relevantDocuments') {
        setFormData(prev => ({
          ...prev,
          relevantDocuments: Array.from(e.target.files || [])
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: e.target.files![0]
        }));
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Project Details" },
    { number: 3, title: "Requirements" },
    { number: 4, title: "Documents" }
  ];

  return (
    // <div className={`min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 ${
    //   isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    // }`}>
    // <>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Create New Project
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Fill in the details below to create a new project for labourers
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="flex flex-col items-center"
              >
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep === step.number 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : currentStep > step.number || completedSteps[step.number]
                        ? 'bg-green-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-200 text-gray-500'
                  } transition-all duration-300`}
                >
                  {currentStep > step.number || completedSteps[step.number] ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  currentStep === step.number 
                    ? 'text-indigo-500' 
                    : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <div className={`absolute top-0 left-0 h-1 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            } w-full rounded-full`}></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Form Container */}
        <div className={`rounded-2xl shadow-xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <form onSubmit={(e) => {
            if (currentStep === 4) {
              handleSubmit(e);
            } else {
              e.preventDefault();
            }
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold">Project Basics</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                          Project Title
                        </label>
                        <Input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a clear, descriptive title"
                          required
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          Project Description
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the project in detail including scope, purpose, and expectations"
                          required
                          className={`min-h-[150px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          A detailed description helps attract qualified labourers
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            Country
                          </label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => setFormData({ ...formData, country: value })}
                          >
                            <SelectTrigger className={`w-full ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            State
                          </label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData({ ...formData, state: value })}
                            disabled={formData.country !== "India"}
                          >
                            <SelectTrigger className={`w-full ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold">Project Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <DollarSign className="w-4 h-4 text-indigo-500" />
                          Daily Rate
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            type="number"
                            value={formData.dailyRate}
                            onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                            placeholder="0.00"
                            required
                            min="0"
                            step="0.01"
                            className={`pl-8 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Enter the daily payment rate for labourers
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Duration (Days)
                        </label>
                        <Input
                          type="number"
                          value={formData.durationDays}
                          onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                          placeholder="Number of days"
                          required
                          min="1"
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Estimated duration of the project
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Users className="w-4 h-4 text-indigo-500" />
                          Max Labourers
                        </label>
                        <Input
                          type="number"
                          value={formData.maxLabourers}
                          onChange={(e) => setFormData({ ...formData, maxLabourers: e.target.value })}
                          placeholder="Maximum team size"
                          required
                          min="1"
                          max="255"
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Maximum number of labourers needed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Expected project start date
                        </p>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          Application Deadline
                        </label>
                        <Input
                          type="date"
                          value={formData.applicationDeadline}
                          onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last date for labourers to apply
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Company and Requirements */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold">Company & Requirements</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                          Company Name
                        </label>
                        <Input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Your company or organization name"
                          required
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Tag className="w-4 h-4 text-indigo-500" />
                          Category
                        </label>
                        <Input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Project category"
                          required
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Tag className="w-4 h-4 text-indigo-500" />
                          Required Skills (comma separated)
                        </label>
                        <Input
                          type="text"
                          value={formData.requiredSkills}
                          onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                          placeholder="e.g. Construction, Carpentry, Plumbing"
                          required
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          These skills will be used to match your project with qualified labourers
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Documents and Files */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold">Documents & Files</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          Document Description
                        </label>
                        <Textarea
                          value={formData.relevantDocsDescription}
                          onChange={(e) => setFormData({ ...formData, relevantDocsDescription: e.target.value })}
                          placeholder="Describe the purpose of the documents you're uploading"
                          className={`min-h-[100px] ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                        />
                      </div>

                      <div className={`p-6 rounded-xl border-2 border-dashed ${
                        isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <label className="flex flex-col items-center gap-3 cursor-pointer">
                          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">Project Image</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formData.projectImage ? (formData.projectImage as File).name : 'Upload a representative image for your project'}
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'projectImage')}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`mt-2 ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            Select File
                          </Button>
                        </label>
                      </div>
                      
                      <div className={`p-6 rounded-xl border-2 border-dashed ${
                        isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <label className="flex flex-col items-center gap-3 cursor-pointer">
                          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">Additional Documents</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formData.relevantDocuments.length > 0 
                                ? `${formData.relevantDocuments.length} file(s) selected` 
                                : 'Upload any relevant project documents'}
                            </p>
                          </div>
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, 'relevantDocuments')}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`mt-2 ${
                              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            Select Files
                          </Button>
                        </label>
                      </div>
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl ${
                          isDarkMode ? 'bg-red-900/30 text-red-200 border border-red-700/30' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Form Navigation */}
            <div className={`flex justify-between p-8 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextStep();
                  }}
                  disabled={!completedSteps[currentStep]}
                  className={`px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white ${
                    !completedSteps[currentStep] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
  );
}