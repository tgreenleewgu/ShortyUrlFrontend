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
  useWindowDimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Cookies from 'js-cookie';

export const unstable_settings = {
  initialRouteName: 'Analytics',
  screenOptions: {
    tabBarStyle: { display: 'none' },
  },
};

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();

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
      await fetch('http://localhost:8000/api/csrf/', {
        credentials: 'include',
      });

      const csrfToken = Cookies.get('csrftoken');

      await axios.delete(`http://localhost:8000/api/analytics/${shortCode}/`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
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

      {loading ? (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centeredContent}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </View>
      ) : urls.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={{ color: theme.text, textAlign: 'center' }}>No URLs found.</Text>
        </View>
      ) : (
        <FlatList
          data={urls}
          keyExtractor={(item) => item.short_code}
          contentContainerStyle={[styles.list, { alignItems: 'center', paddingBottom: 100 }]}
          ListHeaderComponent={
            <View style={styles.innerContainer}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>Your Analytics</Text>
              <Text style={[styles.subtext, { color: theme.muted }]}>Track performance of your shortened URLs</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: theme.primary, width: width - 40 }]}>
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
    width: '100%',
    maxWidth: 700,
    marginBottom: 24,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  card: {
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    borderLeftWidth: 20,
  },
  urlText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  copyText: {
    marginTop: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  copyConfirmation: {
    color: '#28a745',
    marginTop: 8,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});