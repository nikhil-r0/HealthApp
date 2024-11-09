import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Initialize Firebase only if it hasn't been initialized already
if (!firebase.apps.length) {
  const config = {
    apiKey: "AIzaSyBexdERIUu_9MjXuw1XWgQaU1c4ZWw4cxQ",
    authDomain: "healthapp-c5029.firebaseapp.com",
    projectId: "healthapp-c5029",
    storageBucket: "healthapp-c5029.firebasestorage.app",
    messagingSenderId: "444175138206",
    appId: "1:444175138206:web:fa655d674f421c94f36a8f",
    measurementId: "G-X466FFJFS0"
  };
  firebase.initializeApp(config);
}

function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("Previously Signed In");
        navigation.replace('(tabs)');  // Navigate to Home if already signed in
      }
    });
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  const handleSignIn = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Signed in successfully!');
        navigation.replace('(tabs)'); // Navigate to Home on successful sign-in
      })
      .catch(error => Alert.alert('Sign-In Error', error.message));
  };

  const handleSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Account created successfully! Please sign in.');
        setIsSignUp(false);
      })
      .catch(error => Alert.alert('Sign-Up Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My App</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Create an Account' : 'Sign In to Continue'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button 
        title={isSignUp ? "Sign Up" : "Sign In"} 
        onPress={isSignUp ? handleSignUp : handleSignIn} 
      />

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  toggleText: {
    marginTop: 15,
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default SignInScreen;
