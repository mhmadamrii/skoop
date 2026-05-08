import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import { expoClient } from '@better-auth/expo/client';
import { env } from '@skoop/env/native';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
  ],
});
