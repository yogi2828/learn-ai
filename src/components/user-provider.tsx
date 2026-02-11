'use client';
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { useFirebase } from '@/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type UserRole = 'student' | 'teacher' | 'admin';

export type User = {
  id: string; // firebase uid
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  // for profile page
  firstName: string;
  lastName:string;
  phone: string;
  address: string;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  // For registration
  createUserProfile: (firebaseUser: FirebaseUser, data: any) => Promise<void>;
  // For profile page
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  // For admin user management
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const profile = userDoc.data() as UserProfile;
              const fallbackAvatar = PlaceHolderImages.find(p => p.id === `${profile.role}-avatar-1`)?.imageUrl ?? PlaceHolderImages.find(p => p.id === 'student-avatar-1')!.imageUrl;
              setUser({
                id: firebaseUser.uid,
                name: `${profile.firstName} ${profile.lastName}`,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                role: profile.role,
                avatarUrl: profile.avatarUrl || fallbackAvatar,
                phone: profile.phone || '',
                address: profile.address || '',
              });
            } else {
                // This case might happen if profile creation failed.
                // Log them out to be safe.
                auth.signOut();
                setUser(null);
            }
        } catch(error: any) {
            const permissionError = new FirestorePermissionError({ path: userDocRef.path, operation: 'get' }, error);
            errorEmitter.emit('permission-error', permissionError);
            auth.signOut();
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, firestore]);

  const createUserProfile = async (firebaseUser: FirebaseUser, data: any) => {
    const fallbackAvatar = PlaceHolderImages.find(p => p.id === `${data.role}-avatar-1`)?.imageUrl ?? PlaceHolderImages.find(p => p.id === 'student-avatar-1')!.imageUrl;

    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    const newUserProfile: UserProfile = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      state: data.state,
      phone: data.phone,
      address: data.address,
      avatarUrl: fallbackAvatar,
    };
    await setDoc(userDocRef, newUserProfile)
      .catch((error) => {
        const permissionError = new FirestorePermissionError({ path: userDocRef.path, operation: 'create', requestResourceData: newUserProfile }, error);
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    });
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if(!user) return;
    const userDocRef = doc(firestore, 'users', user.id);
    const {name, avatarUrl, ...profileData} = data;
    await updateDoc(userDocRef, profileData)
     .catch((error) => {
        const permissionError = new FirestorePermissionError({ path: userDocRef.path, operation: 'update', requestResourceData: profileData }, error);
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    });

    setUser(prev => {
      if (!prev) return null;
      const newFirstName = data.firstName || prev.firstName;
      const newLastName = data.lastName || prev.lastName;
      return { 
        ...prev, 
        ...data, 
        name: `${newFirstName} ${newLastName}` 
      };
    });
  }

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!user || user.role !== 'admin') {
      throw new Error("You don't have permission to perform this action.");
    }
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, { role })
    .catch((error) => {
        const permissionError = new FirestorePermissionError({ path: userDocRef.path, operation: 'update', requestResourceData: { role } }, error);
        errorEmitter.emit('permission-error', permissionError);
        throw error;
    });
  };

  const value = { user, loading, createUserProfile, updateUserProfile, updateUserRole };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
