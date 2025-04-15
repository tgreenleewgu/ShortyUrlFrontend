import { Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase-client';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // Logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Error", "Failed to log out.");
        console.error("Logout error:", error.message);
        return;
      }
      router.replace("/(auth)/login"); // Redirect to login page after logout
    } catch (e) {
      console.error("Exception during logout:", e.message);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // Navigate to Settings
  const goToSettings = () => {
    router.push("/(settings)"); // Correct path to settings/index.js
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#5E72E4', dark: '#1A202C' }}
      headerImage={
        <Image
          source={require('@/assets/images/shortyurl-logo-purple.svg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Directions</ThemedText>
      </ThemedView>

      <ThemedView style={styles.introContainer}>
        <ThemedText style={styles.introText}>
          The easiest way to create and manage shortened URLs.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How It Works</ThemedText>
        <ThemedText>
          Create short, memorable links for your long URLs in seconds.
          Track clicks and manage all your links in one place.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Create a Link</ThemedText>
        <ThemedText>
          Paste your long URL and get a shortened version instantly.
          You can even customize your short links with memorable words.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Share Anywhere</ThemedText>
        <ThemedText>
          Share your shortened URLs on social media, emails, messages,
          or anywhere else. They're perfect for presentations and business cards too!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Track Performance</ThemedText>
        <ThemedText>
          Monitor how many people click your links and when.
          All your link statistics are available in your dashboard.
        </ThemedText>
      </ThemedView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          LOGOUT
        </ThemedText>
      </TouchableOpacity>

      {/* Go to Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          GO TO SETTINGS
        </ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light background color
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  introContainer: {
    backgroundColor: 'rgba(94, 114, 228, 0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  introText: {
    fontSize: 18,
    textAlign: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#5E72E4',
    paddingLeft: 14,
  },
  headerImage: {
    height: 180,
    width: '100%',
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
