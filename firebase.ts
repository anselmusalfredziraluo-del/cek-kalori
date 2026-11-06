import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_wAUCc_aO1m7XuKJjzRHmzvnnPhck-Lc",
  authDomain: "cek-kalori-f6155.firebaseapp.com",
  projectId: "cek-kalori-f6155",
  storageBucket: "cek-kalori-f6155.firebasestorage.app",
  messagingSenderId: "1094245097999",
  appId: "1:1094245097999:web:3bf5100d6bab12d9afb97a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);