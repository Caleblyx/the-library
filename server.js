// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuqNEVomb7J7GPWivOt7zpwE-kGPlBzBo",
  authDomain: "test-5e1bb.firebaseapp.com",
  databaseURL: "https://test-5e1bb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-5e1bb",
  storageBucket: "test-5e1bb.appspot.com",
  messagingSenderId: "542108155551",
  appId: "1:542108155551:web:70647b7a2ff6f5534eecaa",
  measurementId: "G-ZPSY4R0CFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

