import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyBexdERIUu_9MjXuw1XWgQaU1c4ZWw4cxQ",
  authDomain: "healthapp-c5029.firebaseapp.com",
  projectId: "healthapp-c5029",
  storageBucket: "healthapp-c5029.firebaseapp.com",
  messagingSenderId: "444175138206",
  appId: "1:444175138206:web:fa655d674f421c94f36a8f",
  measurementId: "G-X466FFJFS0",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

let authPersistence;
if (Platform.OS === 'web') {
  // Use localStorage for web
  authPersistence = browserLocalPersistence;
} else {
  // Use AsyncStorage for React Native
  authPersistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

const auth = initializeAuth(app, {
  persistence: authPersistence,
});

export { db, auth };
