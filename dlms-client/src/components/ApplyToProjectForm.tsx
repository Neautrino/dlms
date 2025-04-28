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
    description: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 1;

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
                Tell us why you're the perfect fit for this project
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
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

              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </Button>
                
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
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}