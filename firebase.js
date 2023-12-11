// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDZ0Hz23N-_jvkGOjRIhm0vHb2jJLRpuE",
  authDomain: "clinic-530ab.firebaseapp.com",
  projectId: "clinic-530ab",
  storageBucket: "clinic-530ab.appspot.com",
  messagingSenderId: "179100938020",
  appId: "1:179100938020:web:8b23c998033eefcac48db1",
  measurementId: "G-YVX02EWLRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default {db, auth};

