'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css'; // Important for button styles
import { useEffect, useState } from 'react';
import RegistrationPage from '@/components/pages/RegistrationPage';
import UserDashboard from '@/components/pages/UserDashboard';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@/lib/atoms';
import { FullUserData } from '@/types/user';
import { MOCK_USERS } from '@/lib/DummyData';

function Page() {
  const { connected, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useAtom(currentUserAtom);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      // If we already have user data in the atom, use it
      if (user) {
        setIsRegistered(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get-user-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
          }),
        });

        const data = await response.json();
        setIsRegistered(data.exists);
        
        if (data.exists && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
        setIsRegistered(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRegistration();
  }, [publicKey, setUser, user]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full relative z-10 border border-white/10">
          <h2 className="text-2xl font-bold mb-2 text-white">Connect Your Wallet</h2>
          <p className="mb-6 text-gray-300 text-center">To continue, please connect your Solana wallet to DLabor.</p>
          {/* Use WalletMultiButton to let user connect */}
          <WalletMultiButton className="!bg-gradient-to-r from-indigo-500 to-purple-600 !text-white !font-semibold !text-lg !rounded-xl !shadow-lg hover:scale-105 transition-transform px-8 py-3" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <RegistrationPage />;
  }

  return <UserDashboard userData={user} />;
  // return <UserDashboard userData={MOCK_USERS[0]} />;
}

export default Page;
