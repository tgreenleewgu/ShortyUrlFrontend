// // App.js
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { RadioButton } from 'react-native-paper';
// // Uncomment this for clipboard functionality
// import * as Clipboard from 'expo-clipboard';
//
// export default function App() {
//   const [urlType, setUrlType] = useState('default');
//   const [longUrl, setLongUrl] = useState('');
//   const [customAlias, setCustomAlias] = useState('');
//   const [shortUrl, setShortUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [responseMessage, setResponseMessage] = useState('');
//   const [responseStatus, setResponseStatus] = useState('');
//
//   // Updated backend URL as provided
//   const API_URL = 'http://localhost:8000';
//   const API_ENDPOINT = '/api/shorten/';
//
//   const shortenUrl = async () => {
//     if (!longUrl.trim()) {
//       setResponseStatus('error');
//       setResponseMessage('Please enter a URL to shorten');
//       return;
//     }
//
//     if (urlType === 'custom' && !customAlias.trim()) {
//       setResponseStatus('error');
//       setResponseMessage('Please enter a custom alias');
//       return;
//     }
//
//     setIsLoading(true);
//     setResponseMessage('');
//     setResponseStatus('');
//     setShortUrl('');
//
//     try {
//       // Using the exact format as specified in your backend
//       const requestBody = urlType === 'default'
//         ? { original_url: longUrl }
//         : { original_url: longUrl, custom_code: customAlias };
//
//       console.log('Sending request to:', `${API_URL}${API_ENDPOINT}`);
//       console.log('Request body:', JSON.stringify(requestBody));
//
//       const response = await fetch(`${API_URL}${API_ENDPOINT}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });
//
//       // Log raw response for debugging
//       const responseText = await response.text();
//       console.log('Raw response:', responseText);
//
//       // Parse the response if it's JSON
//       let data;
//       try {
//         data = JSON.parse(responseText);
//         console.log('Parsed response:', data);
//       } catch (e) {
//         console.log('Response is not JSON:', e);
//         data = { error: 'Invalid response format' };
//       }
//
//       if (!response.ok) {
//         setResponseStatus('error');
//         const errorMsg = data.message || data.error || data.detail || `Server error: ${response.status}`;
//         setResponseMessage(errorMsg);
//         console.error('Error response:', errorMsg);
//       } else {
//         // Success case - check for the shortened URL in the response
//         // Look for common field names in URL shortener APIs
//         const shortenedUrl = data.short_url || data.shortened_url || data.url || '';
//
//         if (shortenedUrl) {
//           setShortUrl(shortenedUrl);
//           setResponseStatus('success');
//           setResponseMessage('URL shortened successfully!');
//         } else {
//           console.log('Response received but URL not found in expected fields');
//           // Display the raw response for debugging
//           setResponseStatus('success');
//           setResponseMessage('URL processed. Check console for details.');
//
//           // Try to find any URL-like string in the response
//           const responseStr = JSON.stringify(data);
//           const urlRegex = /(https?:\/\/[^\s"]+)/g;
//           const matches = responseStr.match(urlRegex);
//           if (matches && matches.length > 0) {
//             setShortUrl(matches[0]);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error in API call:', error);
//       setResponseStatus('error');
//       setResponseMessage(`API Error: ${error.message || 'Unknown error occurred'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const resetForm = () => {
//     setLongUrl('');
//     setCustomAlias('');
//     setShortUrl('');
//     setResponseMessage('');
//     setResponseStatus('');
//   };
//
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="auto" />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.card}>
//           <Text style={styles.title}>ShortyUrl here</Text>
//
//           <Text style={styles.label}>URL Type:</Text>
//           <View style={styles.radioGroup}>
//             <View style={styles.radioOption}>
//               <RadioButton
//                 value="default"
//                 status={urlType === 'default' ? 'checked' : 'unchecked'}
//                 onPress={() => setUrlType('default')}
//                 color="#007BFF"
//               />
//               <Text onPress={() => setUrlType('default')}>Default</Text>
//             </View>
//
//             <View style={styles.radioOption}>
//               <RadioButton
//                 value="custom"
//                 status={urlType === 'custom' ? 'checked' : 'unchecked'}
//                 onPress={() => setUrlType('custom')}
//                 color="#007BFF"
//               />
//               <Text onPress={() => setUrlType('custom')}>Custom</Text>
//             </View>
//           </View>
//
//           <Text style={styles.label}>Enter Long URL:</Text>
//           <TextInput
//             style={styles.input}
//             value={longUrl}
//             onChangeText={setLongUrl}
//             placeholder="https://example.com/very/long/url"
//             autoCapitalize="none"
//             keyboardType="url"
//           />
//
//           {urlType === 'custom' && (
//             <>
//               <Text style={styles.label}>Custom Code:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={customAlias}
//                 onChangeText={setCustomAlias}
//                 placeholder="mypage"
//                 autoCapitalize="none"
//               />
//             </>
//           )}
//
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[styles.button, styles.primaryButton]}
//               onPress={shortenUrl}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.buttonText}>Shorten URL</Text>
//               )}
//             </TouchableOpacity>
//
//             <TouchableOpacity
//               style={[styles.button, styles.secondaryButton]}
//               onPress={resetForm}
//               disabled={isLoading}
//             >
//               <Text style={styles.secondaryButtonText}>Reset</Text>
//             </TouchableOpacity>
//           </View>
//
//           {/* Response message area */}
//           {responseMessage ? (
//             <View style={[
//               styles.messageContainer,
//               responseStatus === 'success' ? styles.successMessage : styles.errorMessage
//             ]}>
//               <Text style={styles.messageText}>{responseMessage}</Text>
//             </View>
//           ) : null}
//
//           {/* Shortened URL result area */}
//           {shortUrl ? (
//             <View style={styles.resultContainer}>
//               <Text style={styles.resultLabel}>Shortened URL:</Text>
//               <Text style={styles.resultUrl}>{shortUrl}</Text>
//
//               <TouchableOpacity
//                 style={[styles.button, styles.primaryButton, styles.copyButton]}
//                 onPress={async () => {
//                   try {
//                     // Uncomment these lines for actual functionality
//                     await Clipboard.setStringAsync(shortUrl);
//                     Alert.alert('Copied!', 'URL copied to clipboard');
//                   } catch (error) {
//                     Alert.alert('Error', 'Failed to copy to clipboard');
//                   }
//                 }}
//               >
//                 <Text style={styles.buttonText}>Copy URL</Text>
//               </TouchableOpacity>
//             </View>
//           ) : null}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
//
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   card: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#8A2BE2',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: '#EEEEEE',
//     marginBottom: 8,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioText: {
//     color: '#FFF',
//   },
//   input: {
//     backgroundColor: '#2C2C2C',
//     color: '#FFFFFF',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#8A2BE2',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   button: {
//     flex: 1,
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   primaryButton: {
//     backgroundColor: '#8A2BE2',
//   },
//   secondaryButton: {
//     backgroundColor: '#333',
//     borderWidth: 1,
//     borderColor: '#8A2BE2',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   messageContainer: {
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   successMessage: {
//     backgroundColor: '#28a745',
//   },
//   errorMessage: {
//     backgroundColor: '#dc3545',
//   },
//   messageText: {
//     color: '#FFF',
//     fontSize: 16,
//   },
//   resultContainer: {
//     backgroundColor: '#1E1E1E',
//     padding: 15,
//     borderRadius: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: '#8A2BE2',
//   },
//   resultUrl: {
//     fontSize: 16,
//     color: '#8A2BE2',
//     marginBottom: 10,
//   },
//   copyButton: {
//     marginTop: 10,
//     backgroundColor: '#8A2BE2',
//   },
// });
//
//
//


// App.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RadioButton } from 'react-native-paper';
// Uncomment this for clipboard functionality
import * as Clipboard from 'expo-clipboard';

// Simple text-based logo component instead of SVG
const ShortyUrlLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>Shorty</Text>
      <Text style={styles.logoSubText}>URL</Text>
    </View>
  );
};

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
          {/* Use the text-based logo component */}
          <ShortyUrlLogo />

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
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  // Logo styles
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
});

