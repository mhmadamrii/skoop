import { expo } from '@better-auth/expo';
import { createPrismaClient } from '@skoop/db';
import { betterAuth } from 'better-auth';
import { env } from '@skoop/env/server';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),

    trustedOrigins: [
      env.CORS_ORIGIN,
      'skoop://',
      ...(env.NODE_ENV === 'development'
        ? [
            'exp://',
            'http://localhost:8081',
            'http://192.168.1.194:8081',
            'exp://192.168.1.194:8081',
            'http://192.168.1.194:3000',
          ]
        : []),
    ],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [expo()],
  });
}

export const auth = createAuth();
