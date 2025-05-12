import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#E0E0E0',
    fontFamily: 'Poppins-Bold', // Make sure you load this font!
  },
  label: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#E0E0E0',
    backgroundColor: '#2A2A2A',
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2', // Deep purple
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  successMessage: {
    backgroundColor: '#28a745',
  },
  errorMessage: {
    backgroundColor: '#dc3545',
  },
});
