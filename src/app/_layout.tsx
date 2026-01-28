/**
 * Root Layout - Expo Router
 *
 * This is the main entry point for the app.
 * It sets up the navigation stack, global providers, and database initialization.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ErrorBoundary, ToastProvider } from '../shared/ui/components';
import { useDatabase } from '../shared/hooks/use-database';
import { colors } from '../shared/ui/theme';

/**
 * Loading screen during database initialization
 */
function LoadingScreen(): React.JSX.Element {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Lade Datenbank...</Text>
    </View>
  );
}

/**
 * Error screen when database initialization fails
 */
function DatabaseErrorScreen({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}): React.JSX.Element {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Datenbankfehler</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.retryButton} onPress={onRetry}>
        Erneut versuchen
      </Text>
    </View>
  );
}

export default function RootLayout(): React.JSX.Element {
  const { isLoading, error, retry } = useDatabase();

  // Show loading screen while database initializes
  if (isLoading) {
    return (
      <ErrorBoundary>
        <StatusBar style="auto" />
        <LoadingScreen />
      </ErrorBoundary>
    );
  }

  // Show error screen if database initialization failed
  if (error) {
    return (
      <ErrorBoundary>
        <StatusBar style="auto" />
        <DatabaseErrorScreen error={error} onRetry={retry} />
      </ErrorBoundary>
    );
  }

  // Database is ready, show main app
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});
