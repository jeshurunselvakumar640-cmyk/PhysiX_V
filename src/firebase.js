import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  reload,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  runTransaction
} from "firebase/firestore";

// Firebase Configuration from User Project
const firebaseConfig = {
  apiKey: "AIzaSyDEp6ZlkieVFUeC4mdUrP8g8AymT14PQwc",
  authDomain: "physix-d4860.firebaseapp.com",
  projectId: "physix-d4860",
  storageBucket: "physix-d4860.firebasestorage.app",
  messagingSenderId: "180090395467",
  appId: "1:180090395467:web:b2a79a451c0676f131e6ce",
  measurementId: "G-1V2QBTZGF4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let db = null;
try {
  db = getFirestore(app);
} catch (e) {
  console.warn("Firestore initialization notice:", e);
}

let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export {
  app,
  auth,
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
  db,
  analytics,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  runTransaction,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  reload,
  onAuthStateChanged
};
export default app;
