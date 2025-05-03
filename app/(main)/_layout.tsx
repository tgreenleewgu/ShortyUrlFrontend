//
// import { Tabs, router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { Platform, ActivityIndicator, View } from 'react-native';
//
// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { supabase } from '@/lib/supabase-client';
// import { Ionicons } from '@expo/vector-icons';
//
// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     checkAuth();
//   }, []);
//
//   const checkAuth = async () => {
//     const { data, error } = await supabase.auth.getUser();
//     if (error || !data?.user) {
//       router.replace("/(auth)/login"); // Redirect to login if not authenticated
//     } else {
//       setUser(data.user);
//     }
//     setLoading(false);
//   };
//
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }
//
//   return user ? (
//
// <Tabs
//   screenOptions={{
//     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//     headerShown: false,
//     tabBarButton: HapticTab,
//     tabBarBackground: TabBarBackground,
//     tabBarStyle: Platform.select({
//       ios: {
//         // Use a transparent background on iOS to show the blur effect
//         position: 'absolute',
//       },
//       default: {},
//     }),
//   }}
// >
//   {/* Home Screen */}
//   <Tabs.Screen
//     name="index"
//     options={{
//       title: 'Home',
//       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//     }}
//   />
//
//   {/* Explore Screen (Renamed from Analytics) */}
//   <Tabs.Screen
//     name="Explore"
//     options={{
//       title: 'Explore',
//       tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifying glass.circle.fill" color={color} />,
//     }}
//   />
//
//   {/* Create URL Screen */}
//   <Tabs.Screen
//     name="CreateURL"
//     options={{
//       title: 'Create URL',
//      tabBarIcon: ({ color }) => <IconSymbol size={28} name="link.badge.plus" color={color} />
//
//     }}
//   />
// </Tabs>
//  ) : null; // Don't render tabs if user is not authenticated
//  }
import { Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const BACKEND_URL = 'http://localhost:8000';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/me/`, {
//           credentials: 'include',
//         });
//
//         if (!res.ok) throw new Error('Not authenticated');
//
//         const data = await res.json();
//         if (data.username && isMounted) {
//           setUser(data.username);
//         } else {
//           throw new Error('Missing username');
//         }
//       } catch (err) {
//         if (isMounted) {
//           router.replace('/(auth)/login');
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };
    const checkAuth = async () => {
      try {
        console.log("🔍 Checking session...");
        const res = await fetch(`${BACKEND_URL}/api/me/`, {
          credentials: 'include',
        });

        console.log("✅ Status:", res.status);

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();
        console.log("✅ Response data:", data);

        if (data.username) {
          setUser(data.username);
        } else {
          throw new Error("No username found");
        }
      } catch (err) {
        console.log("❌ Redirecting to login:", err.message);
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };


    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifying glass.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CreateURL"
        options={{
          title: 'Create URL',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="link.badge.plus" color={color} />,
        }}
      />
    </Tabs>
  ) : null;
}

