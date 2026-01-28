/**
 * Modal Screen - Info/Details
 */
import { View, Text, StyleSheet } from 'react-native';

export default function ModalScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info</Text>
      <Text style={styles.text}>CalCalCal - Workout-Routine Builder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
