// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpN46mqOJY0U5jux4lkKrGbl6VpJ8b14A",
  authDomain: "musherfa-b7567.firebaseapp.com",
  projectId: "musherfa-b7567",
  storageBucket: "musherfa-b7567.firebasestorage.app",
  messagingSenderId: "874271598691",
  appId: "1:874271598691:web:c26cf3d5416e4130cf7056",
  measurementId: "G-5KK8S6F010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
