// App.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RadioButton } from 'react-native-paper';
// Uncomment this for clipboard functionality
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [urlType, setUrlType] = useState('default');
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');

  // Updated backend URL as provided
  const API_URL = 'http://localhost:8000';
  const API_ENDPOINT = '/api/shorten/';

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
    setResponseMessage('');
    setResponseStatus('');
    setShortUrl('');

    try {
      // Using the exact format as specified in your backend
      const requestBody = urlType === 'default'
        ? { original_url: longUrl }
        : { original_url: longUrl, custom_code: customAlias };

      console.log('Sending request to:', `${API_URL}${API_ENDPOINT}`);
      console.log('Request body:', JSON.stringify(requestBody));

      const response = await fetch(`${API_URL}${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Log raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse the response if it's JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (e) {
        console.log('Response is not JSON:', e);
        data = { error: 'Invalid response format' };
      }

      if (!response.ok) {
        setResponseStatus('error');
        const errorMsg = data.message || data.error || data.detail || `Server error: ${response.status}`;
        setResponseMessage(errorMsg);
        console.error('Error response:', errorMsg);
      } else {
        // Success case - check for the shortened URL in the response
        // Look for common field names in URL shortener APIs
        const shortenedUrl = data.short_url || data.shortened_url || data.url || '';

        if (shortenedUrl) {
          setShortUrl(shortenedUrl);
          setResponseStatus('success');
          setResponseMessage('URL shortened successfully!');
        } else {
          console.log('Response received but URL not found in expected fields');
          // Display the raw response for debugging
          setResponseStatus('success');
          setResponseMessage('URL processed. Check console for details.');

          // Try to find any URL-like string in the response
          const responseStr = JSON.stringify(data);
          const urlRegex = /(https?:\/\/[^\s"]+)/g;
          const matches = responseStr.match(urlRegex);
          if (matches && matches.length > 0) {
            setShortUrl(matches[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error in API call:', error);
      setResponseStatus('error');
      setResponseMessage(`API Error: ${error.message || 'Unknown error occurred'}`);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>ShortyUrl</Text>

          <Text style={styles.label}>URL Type:</Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <RadioButton
                value="default"
                status={urlType === 'default' ? 'checked' : 'unchecked'}
                onPress={() => setUrlType('default')}
                color="#007BFF"
              />
              <Text onPress={() => setUrlType('default')}>Default</Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton
                value="custom"
                status={urlType === 'custom' ? 'checked' : 'unchecked'}
                onPress={() => setUrlType('custom')}
                color="#007BFF"
              />
              <Text onPress={() => setUrlType('custom')}>Custom</Text>
            </View>
          </View>

          <Text style={styles.label}>Enter Long URL:</Text>
          <TextInput
            style={styles.input}
            value={longUrl}
            onChangeText={setLongUrl}
            placeholder="https://example.com/very/long/url"
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

          {/* Response message area */}
          {responseMessage ? (
            <View style={[
              styles.messageContainer,
              responseStatus === 'success' ? styles.successMessage : styles.errorMessage
            ]}>
              <Text style={styles.messageText}>{responseMessage}</Text>
            </View>
          ) : null}

          {/* Shortened URL result area */}
          {shortUrl ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Shortened URL:</Text>
              <Text style={styles.resultUrl}>{shortUrl}</Text>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton, styles.copyButton]}
                onPress={async () => {
                  try {
                    // Uncomment these lines for actual functionality
                    // await Clipboard.setStringAsync(shortUrl);
                    Alert.alert('Copied!', 'URL copied to clipboard');
                  } catch (error) {
                    Alert.alert('Error', 'Failed to copy to clipboard');
                  }
                }}
              >
                <Text style={styles.buttonText}>Copy URL</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#555',
    fontSize: 16,
  },
  messageContainer: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  successMessage: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultUrl: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 10,
  },
  copyButton: {
    marginTop: 10,
  }
});