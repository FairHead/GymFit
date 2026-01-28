/**
 * Settings Tab
 *
 * Account, sync status, and app preferences.
 * @see TASKS.md Phase 9
 */
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einstellungen</Text>
      <Text style={styles.subtitle}>Konto, Sync und Optionen</Text>
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
