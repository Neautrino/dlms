import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { currentUserAtom, userRegistrationStatusAtom } from '@/lib/atoms';
import { FullUserData, UserRole } from '@/types/user';

export function useUserData() {
  const { connected, publicKey } = useWallet();
  const [user, setUser] = useAtom(currentUserAtom);
  const [registrationStatus, setRegistrationStatus] = useAtom(userRegistrationStatusAtom);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (!publicKey) {
        setRegistrationStatus({ isRegistered: false, role: null });
        return;
      }

      // If we already have user data in the atom, use it
      if (user) {
        setRegistrationStatus({
          isRegistered: true,
          role: user.account.role === UserRole.Labour ? 'labour' : 'manager'
        });
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
        
        if (data.exists && data.user) {
          setUser(data.user);
          setRegistrationStatus({
            isRegistered: true,
            role: data.user.account.role === UserRole.Labour ? 'labour' : 'manager'
          });
        } else {
          setRegistrationStatus({
            isRegistered: false,
            role: null
          });
        }
      } catch (error) {
        console.error('Error checking user registration:', error);
        setRegistrationStatus({
          isRegistered: false,
          role: null
        });
      }
    };

    checkUserRegistration();
  }, [publicKey, setUser, setRegistrationStatus, user]);

  return {
    user,
    registrationStatus,
    isConnected: connected,
    publicKey,
    isLoading: !user && connected && publicKey
  };
} 