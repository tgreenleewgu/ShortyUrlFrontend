import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RadioButton } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { supabase } from '@/lib/supabase-client.js';

const ShortyUrlLogo = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>Shorty</Text>
    <Text style={styles.logoSubText}>URL</Text>
  </View>
);

export default function App({ navigation }) {
  const [urlType, setUrlType] = useState('default');
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = 'http://localhost:8000';
  const API_ENDPOINT = '/api/shorten/';

  useEffect(() => {
    const checkSupabaseSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase session error:', error);
        } else if (session) {
          setUserEmail(session.user.email);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSupabaseSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUserEmail(session.user.email);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setUserEmail('');
        setIsLoggedIn(false);
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      setResponseStatus('error');
      setResponseMessage('Please enter a URL to shorten');
      return;
    }

    if (urlType === 'custom' && !customAlias.trim()) {
      setResponseStatus('error');
      setResponseMessage('Please enter a custom alias');
      return;
    }

    setIsLoading(true);
    setShortUrl('');
    setResponseMessage('');
    setResponseStatus('');

    try {
      const requestBody = urlType === 'default'
        ? { original_url: longUrl }
        : { original_url: longUrl, custom_code: customAlias };

      if (isLoggedIn && userEmail) {
        requestBody.email = userEmail;
      }

      const response = await fetch(`${API_URL}${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { error: 'Invalid response format' };
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || data.detail || `Server error: ${response.status}`;
        setResponseStatus('error');
        setResponseMessage(errorMsg);
      } else {
        const shortenedUrl = data.short_url || data.shortened_url || data.url || '';
        if (shortenedUrl) {
          setShortUrl(shortenedUrl);
          setResponseStatus('success');
          setResponseMessage('URL shortened successfully!');
        } else {
          const matches = JSON.stringify(data).match(/(https?:\/\/[^\s"]+)/g);
          if (matches && matches.length > 0) {
            setShortUrl(matches[0]);
            setResponseStatus('success');
            setResponseMessage('URL processed. Check console for details.');
          }
        }
      }
    } catch (err) {
      setResponseStatus('error');
      setResponseMessage(`API Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLongUrl('');
    setCustomAlias('');
    setShortUrl('');
    setResponseMessage('');
    setResponseStatus('');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout failed:', error);
    } catch (err) {
      console.error('Unexpected logout error:', err);
    }
  };

  const renderLoginSection = () => {
    if (isLoggedIn) {
      return (
        <View style={styles.loginSection}>
          <Text style={styles.userInfo}>Logged in as: {userEmail}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Log in to track your shortened URLs</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('app/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <ShortyUrlLogo />

          <Text style={styles.label}>URL Type:</Text>
          <View style={styles.radioGroup}>
            {['default', 'custom'].map(type => (
              <View key={type} style={styles.radioOption}>
                <RadioButton
                  value={type}
                  status={urlType === type ? 'checked' : 'unchecked'}
                  onPress={() => setUrlType(type)}
                  color="#007BFF"
                />
                <Text onPress={() => setUrlType(type)} style={{ color: '#333' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Enter Long URL:</Text>
          <TextInput
            style={styles.input}
            value={longUrl}
            onChangeText={setLongUrl}
            placeholder="https://example.com/very/long/url"
            placeholderTextColor="#696969"
            autoCapitalize="none"
            keyboardType="url"
          />

          {urlType === 'custom' && (
            <>
              <Text style={styles.label}>Custom Code:</Text>
              <TextInput
                style={styles.input}
                value={customAlias}
                onChangeText={setCustomAlias}
                placeholder="mypage"
                placeholderTextColor="#696969"
                autoCapitalize="none"
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={shortenUrl}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Shorten URL</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={resetForm}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {renderLoginSection()}

          {responseMessage && (
            <View style={[
              styles.messageContainer,
              responseStatus === 'success' ? styles.successMessage : styles.errorMessage
            ]}>
              <Text style={styles.messageText}>{responseMessage}</Text>
            </View>
          )}

          {shortUrl && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Shortened URL:</Text>
              <Text style={styles.resultUrl}>{shortUrl}</Text>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, styles.copyButton]}
                onPress={async () => {
                  try {
                    await Clipboard.setStringAsync(shortUrl);
                    Alert.alert('Copied!', 'URL copied to clipboard');
                  } catch (error) {
                    Alert.alert('Error', 'Failed to copy to clipboard');
                  }
                }}
              >
                <Text style={styles.buttonText}>Copy URL</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',  // Dark background
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',  // Darker card background
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8A2BE2',  // Purple logo text
  },
  logoSubText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#8A2BE2',  // Lighter grey for subtext
  },
  loginSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2C2C2C',  // Darker background for sections
    borderRadius: 12,
    alignItems: 'center',
  },
  userInfo: {
    color: '#DDDDDD',  // Light grey for text
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#DC3545',  // Red for logout button
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    alignItems: 'center',
  },
  loginText: {
    color: '#DDDDDD',
    fontSize: 16,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#8A2BE2',  // Purple for login button
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    color: '#FFFFFF',  // Lighter grey text for labels
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#FFFFFF'
  },
  input: {
    backgroundColor: '#2C2C2C',  // Darker background for inputs
    color: '#FFFFFF',  // White text inside input
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8A2BE2',  // Purple border
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',  // Purple primary button
  },
  secondaryButton: {
    backgroundColor: '#333',  // Dark grey for secondary button
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
  },
  successMessage: {
    backgroundColor: '#28a745',  // Green for success
  },
  errorMessage: {
    backgroundColor: '#dc3545',  // Red for error
  },
  messageText: {
    color: '#FFFFFF',  // White text for messages
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#DDDDDD',  // Light grey text
    fontSize: 16,
    marginBottom: 5,
  },
  resultUrl: {
    color: '#8A2BE2',  // Purple for result URLs
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  copyButton: {
    marginTop: 10,
    width: '80%',
    backgroundColor: '#8A2BE2',  // Purple copy button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholder: {
    color: '#888888',  // Light grey placeholder text
  },
});






