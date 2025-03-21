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

import { Stack, router } from "expo-router"; // Add router import
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase-client";
import { useEffect, useState } from "react";
import { Alert } from 'react-native';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // If no user, redirect to login
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
        // Redirect to login page after successful logout
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
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <View style={{ padding: 16 }}>
        {user ? (
          <>
            <Text style={styles.userInfo}>Logged in as: {user.email}</Text>
            <View style={styles.userDetails}>
              <Text>{JSON.stringify(user, null, 2)}</Text>
            </View>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: "#000968",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  textInput: {
    borderColor: "#000968",
    borderRadius: 4,
    borderStyle: "solid",
    borderWidth: 1,
    padding: 12,
    margin: 8,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userDetails: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  }
});