'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2, Briefcase, Star, Clock, DollarSign, Info, Check, Send } from 'lucide-react';
import { ApplicationStatus } from '@/types/application';
import { Textarea } from './ui/textarea';

interface ApplyToProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectPublicKey: string;
}

export default function ApplyToProjectForm({ isOpen, onClose, projectPublicKey }: ApplyToProjectFormProps) {
  const { publicKey, signTransaction } = useWallet();
  const { resolvedTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    skills: '',
    experience: '',
    availability: '',
    expectedRate: '',
    additionalInfo: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const isDarkMode = resolvedTheme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/apply-to-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          projectPublicKey,
          description: formData.description,
          skills: formData.skills.split(',').map(s => s.trim()),
          experience: formData.experience,
          availability: formData.availability,
          expectedRate: parseFloat(formData.expectedRate) || 0,
          additionalInfo: formData.additionalInfo
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Deserialize and sign the transaction
      const transaction = Transaction.from(bs58.decode(data.serializedTransaction));
      if (!signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }
      const signedTransaction = await signTransaction(transaction);
      
      // Send the signed transaction
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-3xl rounded-3xl p-8 ${
              isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950 text-white' : 'bg-gradient-to-br from-white to-gray-50 text-gray-900'
            } shadow-2xl border border-opacity-30 ${
              isDarkMode ? 'border-purple-500/20' : 'border-indigo-500/20'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute right-6 top-6 p-2 rounded-full ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors duration-300`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Apply to Project
                </h2>
              </div>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Showcase your talents and share why you're the perfect fit
              </p>
              
              {/* Progress Indicator */}
              <div className="flex justify-between items-center mt-8 mb-6">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                        currentStep > index + 1 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : currentStep === index + 1 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                            : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                      } transition-all duration-300`}
                    >
                      {currentStep > index + 1 ? <Check size={18} /> : index + 1}
                    </div>
                    <span className={`text-xs ${
                      currentStep === index + 1 
                        ? 'font-medium ' + (isDarkMode ? 'text-purple-400' : 'text-indigo-600')
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {index === 0 ? 'Introduction' : index === 1 ? 'Skills & Experience' : 'Details'}
                    </span>
                    
                    {/* Connector line */}
                    {index < totalSteps - 1 && (
                      <div className="absolute left-0 right-0 flex items-center justify-center">
                        <div className={`h-0.5 w-full max-w-xs ${
                          currentStep > index + 1 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                        }`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                      bg-opacity-50 backdrop-blur-sm
                      ${isDarkMode 
                        ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                        : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                      }"
                    >
                      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                      
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Your Pitch</span>
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell us why you're interested in this project and what makes you uniquely qualified..."
                        required
                        className={`w-full min-h-[150px] rounded-xl transition-all duration-200 focus:ring-2 ${
                          isDarkMode 
                            ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                            : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                      bg-opacity-50 backdrop-blur-sm
                      ${isDarkMode 
                        ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                        : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                      }"
                    >
                      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                      
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <Star className="w-5 h-5 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Skills</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          placeholder="e.g., React, Solidity, UI/UX, Project Management"
                          className={`w-full pl-4 pr-12 py-3 rounded-xl transition-all duration-200 focus:ring-2 ${
                            isDarkMode 
                              ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                              : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs opacity-70">
                          comma-separated
                        </div>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                      bg-opacity-50 backdrop-blur-sm
                      ${isDarkMode 
                        ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                        : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                      }"
                    >
                      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                      
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <Info className="w-5 h-5 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Relevant Experience</span>
                      </label>
                      <Textarea
                        value={formData.experience}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="Describe your relevant experience, achievements, and previous projects..."
                        className={`w-full min-h-[150px] rounded-xl transition-all duration-200 focus:ring-2 ${
                          isDarkMode 
                            ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                            : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                        bg-opacity-50 backdrop-blur-sm
                        ${isDarkMode 
                          ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                          : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                        }"
                      >
                        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                        
                        <label className="flex items-center gap-2 text-base font-medium mb-3">
                          <Clock className="w-5 h-5 text-indigo-500" />
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Availability</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          placeholder="e.g., Full-time, 20hrs/week, Weekends only"
                          className={`w-full rounded-xl transition-all duration-200 focus:ring-2 ${
                            isDarkMode 
                              ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                              : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                          }`}
                        />
                      </div>

                      <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                        bg-opacity-50 backdrop-blur-sm
                        ${isDarkMode 
                          ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                          : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                        }"
                      >
                        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                        
                        <label className="flex items-center gap-2 text-base font-medium mb-3">
                          <DollarSign className="w-5 h-5 text-indigo-500" />
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Expected Rate (DLT)</span>
                        </label>
                        <Input
                          type="number"
                          value={formData.expectedRate}
                          onChange={(e) => setFormData({ ...formData, expectedRate: e.target.value })}
                          placeholder="Your rate in DLT tokens"
                          className={`w-full rounded-xl transition-all duration-200 focus:ring-2 ${
                            isDarkMode 
                              ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                              : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-opacity-30 p-6 transition-all duration-300 hover:shadow-md
                      bg-opacity-50 backdrop-blur-sm
                      ${isDarkMode 
                        ? 'bg-gray-800/50 border-purple-500/20 hover:border-purple-500/30' 
                        : 'bg-white/70 border-indigo-500/20 hover:border-indigo-500/40'
                      }"
                    >
                      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-600/10 to-purple-600/20 blur-3xl"></div>
                      
                      <label className="flex items-center gap-2 text-base font-medium mb-3">
                        <Info className="w-5 h-5 text-indigo-500" />
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Additional Information</span>
                      </label>
                      <Textarea
                        value={formData.additionalInfo}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        placeholder="Share anything else that might be relevant to your application..."
                        className={`w-full min-h-[120px] rounded-xl transition-all duration-200 focus:ring-2 ${
                          isDarkMode 
                            ? 'bg-gray-900/80 border-gray-700 focus:ring-purple-500/30 focus:border-purple-500' 
                            : 'bg-white border-gray-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 1 ? onClose : prevStep}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}