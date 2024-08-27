import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAXNap3NHUbe_CDtZYWkEZbt6VV9_DmwJk",
  authDomain: "univibe-20667.firebaseapp.com",
  projectId: "univibe-20667",
  storageBucket: "univibe-20667.appspot.com",
  messagingSenderId: "447034952389",
  appId: "1:447034952389:web:ab9c7d7fc6d1cc8f2afeac",
  measurementId: "G-4V0B7ZDZPW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
export default app;