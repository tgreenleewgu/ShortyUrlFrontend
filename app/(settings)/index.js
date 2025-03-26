//import { Stack } from "expo-router";
//import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
//import { supabase } from "../../lib/supabase-client";
//import { useEffect, useState } from "react";
//import { Alert } from 'react-native';
//
//export default function SettingsPage() {
//  const [user, setUser] = useState(null);
//  useEffect(() => {
//    supabase.auth.getUser().then(({ data: { user } }) => {
//      if (user) {
//        setUser(user);
//      } else {
//        Alert.alert("Error Accessing User");
//      }
//    });
//  }, []);
//
//  const doLogout = async () => {
//    const {error} = await supabase.auth.signOut();
//    if (error) {
//      Alert.alert("Error Signing Out User", error.message);
//    }
//  }
//
//  return (
//    <SafeAreaView style={{ flex: 1 }}>
//      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
//      <View style={{ padding: 16 }}>
//        <Text>{JSON.stringify(user, null, 2)}</Text>
//        <TouchableOpacity onPress={doLogout} style={styles.buttonContainer}>
//          <Text style={styles.buttonText}>LOGOUT</Text>
//        </TouchableOpacity>
//      </View>
//    </SafeAreaView>
//  );
//}
//
//
//const styles = StyleSheet.create({
//  container: {
//    marginTop: 40,
//    padding: 12,
//  },
//  verticallySpaced: {
//    paddingTop: 4,
//    paddingBottom: 4,
//    alignSelf: "stretch",
//  },
//  mt20: {
//    marginTop: 20,
//  },
//  buttonContainer: {
//    backgroundColor: "#000968",
//    borderRadius: 10,
//    paddingVertical: 10,
//    paddingHorizontal: 12,
//    margin: 8,
//  },
//  buttonText: {
//    fontSize: 18,
//    color: "#fff",
//    fontWeight: "bold",
//    alignSelf: "center",
//    textTransform: "uppercase",
//  },
//  textInput: {
//    borderColor: "#000968",
//    borderRadius: 4,
//    borderStyle: "solid",
//    borderWidth: 1,
//    padding: 12,
//    margin: 8,
//  },
//});

//import { Stack, router } from "expo-router"; // Add router import
//import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
//import { supabase } from "../../lib/supabase-client";
//import { useEffect, useState } from "react";
//import { Alert } from 'react-native';
//
//export default function SettingsPage() {
//  const [user, setUser] = useState(null);
//  const [loading, setLoading] = useState(false);
//
//  useEffect(() => {
//    fetchUser();
//  }, []);
//
//  const fetchUser = async () => {
//    const { data, error } = await supabase.auth.getUser();
//    if (error) {
//      console.log("Error fetching user:", error.message);
//      Alert.alert("Error", "Could not access user information");
//      return;
//    }
//
//    if (data?.user) {
//      setUser(data.user);
//    } else {
//      console.log("No user found");
//      // If no user, redirect to login
//      router.replace("/(auth)/login");
//    }
//  };
//
////  const sendEmailToBackend = async (email) => {
////    if (!email) {
////      console.error("No user logged in.");
////      return;
////    }
////
////    try {
////      const response = await fetch("http://localhost:8000/api/shorten/", {
////        method: "POST",
////        headers: {
////          "Content-Type": "application/json",
////          Authorization: `Bearer ${email}` // Send email as an identifier
////        },
////        body: JSON.stringify({ email })
////      });
////
////      const data = await response.json();
////      console.log("Backend response:", data);
////    } catch (error) {
////      console.error("Error sending email to backend:", error);
////    }
////  };
//
//const sendEmailToBackend = async () => {
//  const { data, error } = await supabase.auth.getUser();
//  if (error || !data?.user) {
//    console.error("Error fetching user:", error?.message);
//    return;
//  }
//
//  const email = data.user.email;
//  console.log("Sending email:", email); // Debugging log
//
//  const response = await fetch("https://your-backend-url.com/api/user", {
//    method: "POST",
//    headers: {
//      "Content-Type": "application/json",
//      Authorization: `Bearer ${email}`
//    },
//    body: JSON.stringify({ email })
//  });
//
//  const responseData = await response.json();
//  console.log("Backend response:", responseData); // Debugging response
//};
//
//
//  const doLogout = async () => {
//    try {
//      setLoading(true);
//      console.log("Attempting to sign out");
//
//      const { error } = await supabase.auth.signOut();
//
//      if (error) {
//        console.log("Error signing out:", error.message);
//        Alert.alert("Error Signing Out", error.message);
//      } else {
//        console.log("Sign out successful");
//        setUser(null);
//        // Redirect to login page after successful logout
//        router.replace("/(auth)/login");
//      }
//    } catch (e) {
//      console.log("Exception during logout:", e.message);
//      Alert.alert("Error", "An unexpected error occurred");
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return (
//    <SafeAreaView style={{ flex: 1 }}>
//      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
//      <View style={{ padding: 16 }}>
//        {user ? (
//          <>
//            <Text style={styles.userInfo}>Logged in as: {user.email}</Text>
//            <View style={styles.userDetails}>
//              <Text>{JSON.stringify(user, null, 2)}</Text>
//            </View>
//            <TouchableOpacity
//              onPress={doLogout}
//              style={styles.buttonContainer}
//              disabled={loading}
//            >
//              <Text style={styles.buttonText}>
//                {loading ? "LOGGING OUT..." : "LOGOUT"}
//              </Text>
//            </TouchableOpacity>
//          </>
//        ) : (
//          <Text style={styles.loadingText}>Loading user information...</Text>
//        )}
//      </View>
//    </SafeAreaView>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    marginTop: 40,
//    padding: 12,
//  },
//  verticallySpaced: {
//    paddingTop: 4,
//    paddingBottom: 4,
//    alignSelf: "stretch",
//  },
//  mt20: {
//    marginTop: 20,
//  },
//  buttonContainer: {
//    backgroundColor: "#000968",
//    borderRadius: 10,
//    paddingVertical: 10,
//    paddingHorizontal: 12,
//    margin: 8,
//  },
//  buttonText: {
//    fontSize: 18,
//    color: "#fff",
//    fontWeight: "bold",
//    alignSelf: "center",
//    textTransform: "uppercase",
//  },
//  textInput: {
//    borderColor: "#000968",
//    borderRadius: 4,
//    borderStyle: "solid",
//    borderWidth: 1,
//    padding: 12,
//    margin: 8,
//  },
//  userInfo: {
//    fontSize: 16,
//    fontWeight: "bold",
//    marginBottom: 10,
//  },
//  userDetails: {
//    backgroundColor: "#f5f5f5",
//    padding: 10,
//    borderRadius: 5,
//    marginBottom: 20,
//  },
//  loadingText: {
//    textAlign: "center",
//    padding: 20,
//    fontSize: 16,
//  }
//});

import { Stack, router } from "expo-router";
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { supabase } from "../../lib/supabase-client";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false); // 🔹 Toggle state for metadata dropdown

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("Error fetching user:", error.message);
      Alert.alert("Error", "Could not access user information");
      return;
    }

    if (data?.user) {
      setUser(data.user);
    } else {
      console.log("No user found");
      router.replace("/(auth)/login");
    }
  };

  const doLogout = async () => {
    try {
      setLoading(true);
      console.log("Attempting to sign out");

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("Error signing out:", error.message);
        Alert.alert("Error Signing Out", error.message);
      } else {
        console.log("Sign out successful");
        setUser(null);
        router.replace("/(auth)/login");
      }
    } catch (e) {
      console.log("Exception during logout:", e.message);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <View style={{ padding: 16 }}>
        {user ? (
          <>
            <Text style={styles.userInfo}>Logged in as:</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {/* 🔹 Toggle Button for Metadata */}
            <TouchableOpacity
              onPress={() => setShowMetadata(!showMetadata)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonText}>
                {showMetadata ? "Hide Details" : "Show Details"}
              </Text>
            </TouchableOpacity>

            {/* 🔹 Collapsible Metadata Section */}
            {showMetadata && (
              <View style={styles.userDetails}>
                <Text style={styles.jsonText}>{JSON.stringify(user, null, 2)}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={doLogout}
              style={styles.buttonContainer}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "LOGGING OUT..." : "LOGOUT"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading user information...</Text>
        )}

        {/* Go Back to Login */}
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Go to Login</Text>
        </TouchableOpacity>

        {/* Show the Home button ONLY if the user is authenticated */}
        {user && (
          <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 16,
  },
  userInfo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  toggleButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  userDetails: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  jsonText: {
    fontSize: 16,
    fontFamily: "monospace",
    color: "#444",
  },
  buttonContainer: {
    backgroundColor: "#000968",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  goBackButton: {
    backgroundColor: "#d9534f",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  goBackButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  homeButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    padding: 20,
  },
});



