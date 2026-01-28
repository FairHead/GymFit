/**
 * Environment Configuration for CalCalCal
 *
 * Type-safe access to environment variables.
 * All variables must be prefixed with EXPO_PUBLIC_ to be accessible.
 */

interface EnvConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  app: {
    env: 'development' | 'staging' | 'production';
  };
}

export const env: EnvConfig = {
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  },
  app: {
    env: (process.env.EXPO_PUBLIC_APP_ENV as EnvConfig['app']['env']) || 'development',
  },
};

export const isDevelopment = env.app.env === 'development';
export const isProduction = env.app.env === 'production';
