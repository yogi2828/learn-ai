'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: FirestorePermissionError) => {
      // Throwing the error here will cause it to be caught by Next.js's
      // development error overlay, which is exactly what we want for debugging.
      // In production, this would be caught by a top-level error boundary.
      throw error;
    };

    const unsubscribe = errorEmitter.on('permission-error', handler);

    return () => {
      unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
}
