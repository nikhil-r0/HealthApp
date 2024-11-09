// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBexdERIUu_9MjXuw1XWgQaU1c4ZWw4cxQ",
  authDomain: "healthapp-c5029.firebaseapp.com",
  projectId: "healthapp-c5029",
  storageBucket: "healthapp-c5029.firebasestorage.app",
  messagingSenderId: "444175138206",
  appId: "1:444175138206:web:fa655d674f421c94f36a8f",
  measurementId: "G-X466FFJFS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);