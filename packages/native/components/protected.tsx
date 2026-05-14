import { authClient } from '@/lib/auth-client';
import { router } from 'expo-router';
import { useEffect } from 'react';

export function Protected({ children }: { children: React.ReactNode }) {
  const currentUser = authClient.useSession();

  useEffect(() => {
    if (!currentUser?.data) {
      router.push('/');
    }
  }, []);

  return <>{children}</>;
}
