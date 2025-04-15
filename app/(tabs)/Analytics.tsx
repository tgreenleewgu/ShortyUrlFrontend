import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Clipboard } from 'react-native';
import axios from 'axios';
import { supabase } from '../../lib/supabase-client';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/button'; // Make sure this path is correct

export default function TabTwoScreen() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedShortCode, setCopiedShortCode] = useState(null); // Track the short code that was copied
  const [copyMessage, setCopyMessage] = useState(""); // State to track the copy confirmation message

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true); // Ensure loading is true before making the API request

      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

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
          email: userEmail,
        },
      });

      setUrls(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (shortCode: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      await axios.delete(`http://localhost:8000/api/analytics/${shortCode}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // After deleting, refresh the data
      fetchAnalytics();
    } catch (err) {
      console.error("Error deleting URL:", err);
      setError("Failed to delete URL.");
    }
  };

  const copyToClipboard = (shortCode: string) => {
    Clipboard.setString(`http://localhost:8000/s/${shortCode}`);
    setCopiedShortCode(shortCode); // Set the short code of the URL that was copied
    setCopyMessage("Short URL copied to clipboard!");

    // Hide the confirmation message after 10 seconds
    setTimeout(() => {
      setCopyMessage("");
      setCopiedShortCode(null); // Reset the copied short code after timeout
    }, 10000); // Keep the message for 10 seconds
  };

  useEffect(() => {
    fetchAnalytics(); // Fetch analytics when component mounts or refreshes
  }, [fetchAnalytics]); // Re-fetch if `fetchAnalytics` function changes (which it won't)

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
              <ThemedText>
                <TouchableOpacity onPress={() => copyToClipboard(item.short_code)}>
                  <ThemedText type="defaultSemiBold" style={styles.copyText}>
                    Copy Short URL
                  </ThemedText>
                </TouchableOpacity>
              </ThemedText>

              {/* Display confirmation message if this URL was copied */}
              {copiedShortCode === item.short_code && copyMessage && (
                <ThemedText style={styles.copyConfirmation}>{copyMessage}</ThemedText>
              )}

              <Button
                title="Delete"
                color="#e53935"
                onPress={() => handleDelete(item.short_code)}
              />
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  copyConfirmation: {
    color: '#28a745',
    marginTop: 5,
    fontWeight: 'bold', // Bold font for the confirmation message
    fontStyle: 'italic',
    fontSize: 16, // Increase font size slightly for emphasis
  },
});



