
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC27Y5ixwrw3gt-5qj7dcJFxd-a3DDsC0I",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "su-video-edit-tool.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "su-video-edit-tool",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOKEN_COLLECTION = 'oauth_tokens';

export const saveTokens = async (userId: string, tokens: any) => {
  const tokenRef = doc(db, TOKEN_COLLECTION, userId);
  await setDoc(tokenRef, {
    ...tokens,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const getTokens = async (userId: string) => {
  const tokenRef = doc(db, TOKEN_COLLECTION, userId);
  const snapshot = await getDoc(tokenRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};
