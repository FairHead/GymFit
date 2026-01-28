/**
 * Library Tab - Exercise Library
 *
 * Browse and search exercise definitions.
 * @see Konzept.md Section 8 & 9
 */
import { View, Text, StyleSheet } from 'react-native';

export default function LibraryScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Übungsbibliothek</Text>
      <Text style={styles.subtitle}>Durchsuche alle verfügbaren Übungen</Text>
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
