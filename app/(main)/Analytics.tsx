import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'Analytics',
  screenOptions: {
    tabBarStyle: { display: 'none' },
  },
};

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedShortCode, setCopiedShortCode] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [username, setUsername] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me/", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.username) {
        setUsername(data.username);
        return data.username;
      } else {
        throw new Error("User not logged in.");
      }
    } catch (err) {
      setError("Please log in first.");
    }
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await fetchUser();
      if (!currentUser) return;

      const res = await axios.get("http://localhost:8000/api/analytics/", {
        withCredentials: true,
        params: { username: currentUser },
      });

      setUrls(res.data);
    } catch (err) {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (shortCode) => {
    try {
      await axios.delete(`http://localhost:8000/api/analytics/${shortCode}/`, {
        withCredentials: true,
      });
      fetchAnalytics();
    } catch (err) {
      setError("Failed to delete URL.");
    }
  };

  const copyToClipboard = (shortCode) => {
    Clipboard.setString(`http://localhost:8000/s/${shortCode}`);
    setCopiedShortCode(shortCode);
    setCopyMessage("Short URL copied to clipboard!");
    setTimeout(() => {
      setCopyMessage("");
      setCopiedShortCode(null);
    }, 3000);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <TouchableOpacity
        onPress={() => router.replace('/(main)')}
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 999, padding: 10 }}
      >
        <Ionicons name="home-outline" size={28} color={theme.text} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/(main)/CreateUrl')}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 999, padding: 10 }}
      >
        <Ionicons name="link-sharp" size={35} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.centeredContent}>
        <View style={styles.innerContainer}>
          <Text style={[styles.pageTitle, { color: theme.text }]}>Your Analytics</Text>
          <Text style={[styles.subtext, { color: theme.muted }]}>Track performance of your shortened URLs</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          ) : urls.length === 0 ? (
            <Text style={{ color: theme.text, textAlign: 'center' }}>No URLs found.</Text>
          ) : (
            <FlatList
              data={urls}
              keyExtractor={(item) => item.short_code}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
                  <Text style={[styles.urlText, { color: theme.text }]}>{item.original_url}</Text>
                  <Text style={{ color: theme.text }}>Short code: {item.short_code}</Text>
                  <Text style={{ color: theme.text }}>Clicks: {item.clicks}</Text>

                  <TouchableOpacity onPress={() => copyToClipboard(item.short_code)}>
                    <Text style={[styles.copyText, { color: theme.primary }]}>Copy Short URL</Text>
                  </TouchableOpacity>

                  {copiedShortCode === item.short_code && copyMessage && (
                    <Text style={styles.copyConfirmation}>{copyMessage}</Text>
                  )}

                  <TouchableOpacity
                    onPress={() => handleDelete(item.short_code)}
                    style={[styles.deleteButton, { backgroundColor: '#DC3545' }]}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 700,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
    width: '100%',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    width: '100%',
  },
  urlText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  copyText: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  copyConfirmation: {
    color: '#28a745',
    marginTop: 5,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
