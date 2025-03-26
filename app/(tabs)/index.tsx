// // import { Image, StyleSheet, Platform } from 'react-native';
// //
// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';
// //
// // export default function HomeScreen() {
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12'
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //         <ThemedText>
// //           Tap the Explore tab to learn more about what's included in this starter app.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           When you're ready, run{' '}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //     </ParallaxScrollView>
// //   );
// // }
// //
// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// // });
//
// // import { Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
// // import { router } from 'expo-router';
// // import { supabase } from '@/lib/supabase-client';
// //
// // import { HelloWave } from '@/components/HelloWave';
// // import ParallaxScrollView from '@/components/ParallaxScrollView';
// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';
// //
// // export default function HomeScreen() {
// //
// //   // Logout function
// //   const handleLogout = async () => {
// //     try {
// //       const { error } = await supabase.auth.signOut();
// //       if (error) {
// //         Alert.alert("Error", "Failed to log out.");
// //         console.error("Logout error:", error.message);
// //         return;
// //       }
// //       router.replace("/(auth)/login"); // Redirect to login page after logout
// //     } catch (e) {
// //       console.error("Exception during logout:", e.message);
// //       Alert.alert("Error", "An unexpected error occurred.");
// //     }
// //   };
// //
// //   // Navigate to Settings
// //   const goToSettings = () => {
// //       router.push("/(settings)"); // Correct path to settings/index.js
// //     };
// //
// //   return (
// //     <ParallaxScrollView
// //       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
// //       headerImage={
// //         <Image
// //           source={require('@/assets/images/partial-react-logo.png')}
// //           style={styles.reactLogo}
// //         />
// //       }>
// //       <ThemedView style={styles.titleContainer}>
// //         <ThemedText type="title">Welcome!</ThemedText>
// //         <HelloWave />
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
// //         <ThemedText>
// //           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
// //           Press{' '}
// //           <ThemedText type="defaultSemiBold">
// //             {Platform.select({
// //               ios: 'cmd + d',
// //               android: 'cmd + m',
// //               web: 'F12'
// //             })}
// //           </ThemedText>{' '}
// //           to open developer tools.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
// //         <ThemedText>
// //           Tap the Explore tab to learn more about what's included in this starter app.
// //         </ThemedText>
// //       </ThemedView>
// //       <ThemedView style={styles.stepContainer}>
// //         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
// //         <ThemedText>
// //           When you're ready, run{' '}
// //           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
// //           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
// //           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
// //         </ThemedText>
// //       </ThemedView>
// //
// //       {/* Logout Button */}
// //       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// //         <ThemedText type="defaultSemiBold" style={styles.buttonText}>
// //           LOGOUT
// //         </ThemedText>
// //       </TouchableOpacity>
// //
// //       {/* Go to Settings Button */}
// //       <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
// //         <ThemedText type="defaultSemiBold" style={styles.buttonText}>
// //           GO TO SETTINGS
// //         </ThemedText>
// //       </TouchableOpacity>
// //
// //     </ParallaxScrollView>
// //   );
// // }
// //
// // const styles = StyleSheet.create({
// //   titleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   stepContainer: {
// //     gap: 8,
// //     marginBottom: 8,
// //   },
// //   reactLogo: {
// //     height: 178,
// //     width: 290,
// //     bottom: 0,
// //     left: 0,
// //     position: 'absolute',
// //   },
// //   logoutButton: {
// //     backgroundColor: '#d9534f',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 20,
// //     alignSelf: 'center',
// //   },
// //   settingsButton: {
// //     backgroundColor: '#007bff',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 10,
// //     alignSelf: 'center',
// //   },
// //   buttonText: {
// //     fontSize: 18,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// // });
//
// import { Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
// import { router } from 'expo-router';
// import { supabase } from '@/lib/supabase-client';
//
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
//
// export default function HomeScreen() {
//
//   // Logout function
//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         Alert.alert("Error", "Failed to log out.");
//         console.error("Logout error:", error.message);
//         return;
//       }
//       router.replace("/(auth)/login"); // Redirect to login page after logout
//     } catch (e) {
//       console.error("Exception during logout:", e.message);
//       Alert.alert("Error", "An unexpected error occurred.");
//     }
//   };
//
//   // Navigate to Settings
//   const goToSettings = () => {
//     router.push("/(settings)"); // Correct path to settings/index.js
//   };
//
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#5E72E4', dark: '#1A202C' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">ShortyURL</ThemedText>
//         <HelloWave />
//       </ThemedView>
//
//       <ThemedView style={styles.introContainer}>
//         <ThemedText style={styles.introText}>
//           The easiest way to create and manage shortened URLs.
//         </ThemedText>
//       </ThemedView>
//
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">How It Works</ThemedText>
//         <ThemedText>
//           Create short, memorable links for your long URLs in seconds.
//           Track clicks and manage all your links in one place.
//         </ThemedText>
//       </ThemedView>
//
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Create a Link</ThemedText>
//         <ThemedText>
//           Paste your long URL and get a shortened version instantly.
//           You can even customize your short links with memorable words.
//         </ThemedText>
//       </ThemedView>
//
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Share Anywhere</ThemedText>
//         <ThemedText>
//           Share your shortened URLs on social media, emails, messages,
//           or anywhere else. They're perfect for presentations and business cards too!
//         </ThemedText>
//       </ThemedView>
//
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Track Performance</ThemedText>
//         <ThemedText>
//           Monitor how many people click your links and when.
//           All your link statistics are available in your dashboard.
//         </ThemedText>
//       </ThemedView>
//
//       {/* Logout Button */}
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <ThemedText type="defaultSemiBold" style={styles.buttonText}>
//           LOGOUT
//         </ThemedText>
//       </TouchableOpacity>
//
//       {/* Go to Settings Button */}
//       <TouchableOpacity style={styles.settingsButton} onPress={goToSettings}>
//         <ThemedText type="defaultSemiBold" style={styles.buttonText}>
//           GO TO SETTINGS
//         </ThemedText>
//       </TouchableOpacity>
//
//     </ParallaxScrollView>
//   );
// }
//
// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   introContainer: {
//     backgroundColor: 'rgba(94, 114, 228, 0.1)', // Light blue background
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 20,
//   },
//   introText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 16,
//     borderLeftWidth: 3,
//     borderLeftColor: '#5E72E4',
//     paddingLeft: 14,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
//   logoutButton: {
//     backgroundColor: '#d9534f',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//     alignSelf: 'center',
//     width: '80%',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   settingsButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 16,
//     marginBottom: 20,
//     alignSelf: 'center',
//     width: '80%',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

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

