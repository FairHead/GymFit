/**
 * Root Layout - Expo Router
 *
 * This is the main entry point for the app.
 * It sets up the navigation stack and global providers.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary, ToastProvider } from '../shared/ui/components';

export default function RootLayout(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Info',
            }}
          />
        </Stack>
      </ToastProvider>
    </ErrorBoundary>
  );
}
