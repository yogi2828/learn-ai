'use client';
import { ReactNode } from 'react';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore, storage }}>
      {children}
    </FirebaseProvider>
  );
}
