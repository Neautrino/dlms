'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Transaction } from '@solana/web3.js';
import { connection } from '@/utils/program';
import { useSetAtom } from 'jotai';
import { userBalanceAtom } from '@/lib/atoms';

export default function TransferPage() {
  const { publicKey, signTransaction } = useWallet();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const setBalance = useSetAtom(userBalanceAtom);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!publicKey || !signTransaction) {
        throw new Error('Please connect your wallet');
      }

      // Call the mint-token API
      const response = await fetch('/api/mint-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPubkey: publicKey.toString(),
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (!data.transaction) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      // Deserialize the transaction
      const transaction = Transaction.from(
        Buffer.from(data.transaction, 'base64')
      );

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      
      setSuccess(`Successfully minted ${amount} tokens!`);
      setAmount('');

      // Update the user's token balance
      const balanceResponse = await fetch('/api/get-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          userPubkey: publicKey.toString(),
        }),
      });

      const balanceData = await balanceResponse.json();

      if (!balanceData.success) {
        throw new Error(balanceData.error || 'Failed to update token balance');
      }

      setBalance(balanceData.balance);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while minting tokens');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Mint Tokens
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Mint new tokens to your wallet
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl shadow-xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}
      >
        <form onSubmit={handleMint} className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
                Amount to Mint
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                min="0"
                step="0.01"
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter the amount of tokens you want to mint
              </p>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-green-900/30 text-green-200 border border-green-700/30' : 'bg-green-50 text-green-800 border border-green-200'
                }`}
              >
                {success}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !publicKey}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Minting Tokens...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Mint Tokens
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 