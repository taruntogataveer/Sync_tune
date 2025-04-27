import { initializeApp } from "firebase/app";
import {getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyB_tFnbvVkCzm2RdTUGwhI3n9BltSSWwo8",
  authDomain: "synctune-5b106.firebaseapp.com",
  projectId: "synctune-5b106",
  storageBucket: "synctune-5b106.firebasestorage.app",
  messagingSenderId: "58692739127",
  appId: "1:58692739127:web:b4af2803880d6beb229fb2",
  measurementId: "G-JTZBN3YB5Z"
};
  
  const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export {db,auth}