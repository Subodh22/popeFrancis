import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRjgC7m37Q8dNuIw9RHm5zM8gESB1BfSU",
  authDomain: "popefrancis-18934.firebaseapp.com",
  projectId: "popefrancis-18934",
  storageBucket: "popefrancis-18934.appspot.com",
  messagingSenderId: "458223589231",
  appId: "1:458223589231:web:ee54439512a893b5ae3a9a",
  measurementId: "G-3W9J7Q1GKV"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      console.error("Error enabling offline persistence:", err);
    });
}

const storage = getStorage(app);

export { app, auth, db, storage };
