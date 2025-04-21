import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCF5Pss_7v-0NosyZUraoKRWHx40YtUprk",
  authDomain: "packflowing-3ee65.firebaseapp.com",
  projectId: "packflowing-3ee65",
  storageBucket: "packflowing-3ee65.firebasestorage.app",
  messagingSenderId: "336707028976",
  appId: "1:336707028976:web:f8719d57cf0b05febe3f35",
  measurementId: "G-RCT8LDWED7",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);

export { app, database, auth };
