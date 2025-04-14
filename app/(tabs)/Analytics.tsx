import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase-client';
import axios from 'axios';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

//   const fetchAnalytics = async () => {
//     try {
//       const { data: session } = await supabase.auth.getSession();
//       const accessToken = session?.session?.access_token;
//
//       const res = await axios.get("http://localhost:8000/api/analytics/", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//
//
//
//       setUrls(res.data);
//     } catch (err) {
//       console.error("Error fetching analytics:", err);
//       setError("Failed to load analytics.");
//     } finally {
//       setLoading(false);
//     }
//   };

    const fetchAnalytics = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.access_token;

        // Get the user's email from the session
        const { data: userData } = await supabase.auth.getUser(accessToken);
        const userEmail = userData?.user?.email;

        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/analytics/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            email: userEmail // Include the email as a query parameter
          }
        });

        setUrls(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Analytics</ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <ThemedText>{error}</ThemedText>
      ) : urls.length === 0 ? (
        <ThemedText>No URLs found.</ThemedText>
      ) : (
        <FlatList
          data={urls}
          keyExtractor={(item) => item.short_code}
          renderItem={({ item }) => (
            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">{item.original_url}</ThemedText>
              <ThemedText>Short code: {item.short_code}</ThemedText>
              <ThemedText>Clicks: {item.clicks}</ThemedText>
            </ThemedView>
          )}
        />
      )}
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2',
  },
  chartContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  statLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
  },
});

