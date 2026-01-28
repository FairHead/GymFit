/**
 * Routines Tab - Home Screen
 *
 * Lists all workout routines and allows creating new ones.
 * @see Konzept.md Section 3.1 Routine
 */
import { View, Text, StyleSheet } from 'react-native';

export default function RoutinesScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meine Routinen</Text>
      <Text style={styles.subtitle}>Erstelle deine erste Workout-Routine</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
