//import React, { useState } from "react";
//import { Alert, StyleSheet, TextInput, View, Button, Text } from "react-native";
//import { supabase } from "@/lib/supabase-client.js";
//import { TouchableOpacity } from "react-native-gesture-handler";
//import { Stack } from "expo-router";
//
//export default function AuthPage() {
//  const [email, setEmail] = useState("");
//  const [password, setPassword] = useState("");
//  const [loading, setLoading] = useState(false);
//
//  async function signInWithEmail() {
//    setLoading(true);
//    const { error } = await supabase.auth.signInWithPassword({
//      email: email,
//      password: password,
//    });
//
//    if (error) Alert.alert("Sign In Error", error.message);
//    setLoading(false);
//  }
//
//  async function signUpWithEmail() {
//    setLoading(true);
//    const { error } = await supabase.auth.signUp({
//      email: email,
//      password: password,
//    });
//
//    if (error) Alert.alert("Sign Up Error", error.message);
//    setLoading(false);
//  }
//
//  return (
//    <View style={styles.container}>
//      <Stack.Screen options={{ headerShown: true, title: "Supabase Expo Router App" }} />
//      <View style={[styles.verticallySpaced, styles.mt20]}>
//        <TextInput
//          style={styles.textInput}
//          label="Email"
//          onChangeText={(text) => setEmail(text)}
//          value={email}
//          placeholder="email@address.com"
//          autoCapitalize={"none"}
//        />
//      </View>
//      <View style={styles.verticallySpaced}>
//        <TextInput
//          style={styles.textInput}
//          label="Password"
//          onChangeText={(text) => setPassword(text)}
//          value={password}
//          secureTextEntry={true}
//          placeholder="Password"
//          autoCapitalize={"none"}
//        />
//      </View>
//      <View style={[styles.verticallySpaced, styles.mt20]}>
//        <TouchableOpacity
//          disabled={loading}
//          onPress={() => signInWithEmail()}
//          style={styles.buttonContainer}
//        >
//          <Text style={styles.buttonText}>SIGN IN</Text>
//        </TouchableOpacity>
//      </View>
//      <View style={styles.verticallySpaced}>
//        <TouchableOpacity
//          disabled={loading}
//          onPress={() => signUpWithEmail()}
//          style={styles.buttonContainer}
//        >
//          <Text style={styles.buttonText}>SIGN UP</Text>
//        </TouchableOpacity>
//      </View>
//    </View>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: {
//    marginTop: 40,
//    padding: 12,
//    backgroundColor: "#fff", // Adding explicit background color
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
//    color: "#000", // Explicit text color
//    backgroundColor: "#fff", // Explicit background color
//  },
//});

import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Button, Text } from "react-native";
import { supabase } from "@/lib/supabase-client.js";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router } from "expo-router"; // Add router import

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // For displaying status messages

  async function signInWithEmail() {
    setStatus("Attempting sign in..."); // Visual feedback
    console.log("Sign in button pressed"); // Debug log

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      setStatus("Failed: missing fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling supabase.auth.signInWithPassword");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.log("Sign in error:", error.message);
        Alert.alert("Sign In Error", error.message);
        setStatus("Failed: " + error.message);
      } else {
        console.log("Sign in successful", data);
        setStatus("Success!");
        // Redirect after successful login
        router.replace("/"); // Navigate to home or dashboard
      }
    } catch (e) {
      console.log("Exception during sign in:", e.message);
      Alert.alert("Error", "An unexpected error occurred");
      setStatus("Exception: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setStatus("Attempting sign up..."); // Visual feedback
    console.log("Sign up button pressed"); // Debug log

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      setStatus("Failed: missing fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Calling supabase.auth.signUp");
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.log("Sign up error:", error.message);
        Alert.alert("Sign Up Error", error.message);
        setStatus("Failed: " + error.message);
      } else {
        console.log("Sign up successful", data);
        Alert.alert(
          "Registration Successful",
          "Please check your email for confirmation."
        );
        setStatus("Check email for confirmation");
      }
    } catch (e) {
      console.log("Exception during sign up:", e.message);
      Alert.alert("Error", "An unexpected error occurred");
      setStatus("Exception: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Supabase Expo Router App" }} />

      {/* Status message */}
      {status ? (
        <Text style={styles.statusText}>{status}</Text>
      ) : null}

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.textInput}
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor="#888"
          autoCapitalize={"none"}
          color="#000"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.textInput}
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="#888"
          autoCapitalize={"none"}
          color="#000"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          disabled={loading}
          onPress={signInWithEmail} // Removed the arrow function wrapper
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          disabled={loading}
          onPress={signUpWithEmail} // Removed the arrow function wrapper
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    backgroundColor: "#fff",
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
    color: "#000",
    backgroundColor: "#fff",
  },
  statusText: {
    textAlign: "center",
    padding: 10,
    color: "#000",
    fontWeight: "bold",
  },
});