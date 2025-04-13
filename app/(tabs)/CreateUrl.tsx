import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RadioButton } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { supabase } from "@/lib/supabase-client.js";

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

  // ⛓️ Supabase session management
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

      console.log('Sending to backend with email:', userEmail);

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
          setResponseStatus('success');
          setResponseMessage('URL processed. Check console for details.');
          const responseStr = JSON.stringify(data);
          const matches = responseStr.match(/(https?:\/\/[^\s"]+)/g);
          if (matches && matches.length > 0) {
            setShortUrl(matches[0]);
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
          {renderLoginSection()}

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
                <Text onPress={() => setUrlType(type)} style={{ color: '#FFFFFF' }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
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

// ✅ Make sure your `styles` object is defined elsewhere in your file.


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  //Logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  logoSubText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginLeft: 5,
  },
  label: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioText: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',
  },
  secondaryButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#fff',
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
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8A2BE2',
  },
  resultLabel: {
    fontSize: 16,
    color: '#EEEEEE',
    marginBottom: 5,
  },
  resultUrl: {
    fontSize: 16,
    color: '#8A2BE2',
    marginBottom: 10,
  },
  copyButton: {
    marginTop: 10,
    backgroundColor: '#8A2BE2',
  },
  placeholder: {
      color: '#888888',
  },
});


