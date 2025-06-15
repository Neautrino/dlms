'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css'; // Important for button styles
import RegistrationPage from '@/components/pages/RegistrationPage';
import UserDashboard from '@/components/pages/UserDashboard';
import LoadingPage from '@/components/pages/LoadingPage';
import { useUserData } from '@/hooks/use-user-data';

function Page() {
  const { user, registrationStatus, isConnected, isLoading } = useUserData();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-md w-full relative z-10 border border-white/10">
          <h2 className="text-2xl font-bold mb-2 text-white">Connect Your Wallet</h2>
          <p className="mb-6 text-gray-300 text-center">To continue, please connect your Solana wallet to DLabor.</p>
          <WalletMultiButton className="!bg-gradient-to-r from-indigo-500 to-purple-600 !text-white !font-semibold !text-lg !rounded-xl !shadow-lg hover:scale-105 transition-transform px-8 py-3" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (registrationStatus.isRegistered) {
    return <UserDashboard userData={user!} />;
  }

  return <RegistrationPage />;
}

export default Page;
