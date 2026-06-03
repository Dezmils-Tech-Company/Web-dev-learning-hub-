import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Detect if we are using the placeholder / mock credentials
export const isFirebasePlaceholder = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes('placeholder') || 
  firebaseConfig.apiKey === 'mock-api-key';

let firebaseApp;
let firestoreDb: any = null;
let firebaseAuth: any = null;

// Initialize Firebase only if we have real credentials
if (!isFirebasePlaceholder) {
  try {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
      firebaseAuth = getAuth(firebaseApp);
      
      // Test the Firestore connection to surface early configuration errors
      const testConnection = async () => {
        try {
          await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
        } catch (error) {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Firebase is offline. Check connection or credentials.");
          }
        }
      };
      testConnection();
    }
  } catch (err) {
    console.error("Error setting up real Firebase SDK client:", err);
  }
}

export { firebaseApp, firestoreDb as db, firebaseAuth as auth, onAuthStateChanged };

// Core authentication handler functions that automatically bridge 
// between Local Storage sandbox mode and Live Real Firebase mode.
export const authenticateWithGoogle = async () => {
  if (isFirebasePlaceholder || !firebaseAuth) {
    // Simulated Google login for sandbox mode
    return {
      success: true,
      mode: 'sandbox',
      user: {
        id: 'usr-google-gtest',
        email: 'ndegeezra05@gmail.com',
        displayName: 'Ezra Ndege (Google Sandbox)',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      }
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
    return {
      success: true,
      mode: 'live',
      user: {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google Student',
        photoURL: user.photoURL || undefined
      }
    };
  } catch (error: any) {
    console.error("Firebase Google Popup authentication failed:", error);
    throw error;
  }
};

export const registerUserWithEmail = async (email: string, password: string, name: string) => {
  if (isFirebasePlaceholder || !firebaseAuth) {
    // Standalone Sandbox signup
    const userStorageKey = "dezmils_users";
    let storedUsers: any[] = [];
    try {
      const stored = localStorage.getItem(userStorageKey);
      storedUsers = stored ? JSON.parse(stored) : [];
    } catch {}

    const lowerEmail = email.toLowerCase().trim();
    if (storedUsers.some(u => u.email === lowerEmail)) {
      throw new Error("This email is already registered in sandbox. Please log in.");
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: lowerEmail,
      displayName: name.trim(),
      password // stored in sandbox environment for demo state
    };

    storedUsers.push(newUser);
    localStorage.setItem(userStorageKey, JSON.stringify(storedUsers));

    return {
      success: true,
      mode: 'sandbox',
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName
      }
    };
  }

  try {
    // Real Firebase Email-Password Registration
    const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(response.user, { displayName: name });
    return {
      success: true,
      mode: 'live',
      user: {
        id: response.user.uid,
        email: response.user.email || '',
        displayName: name
      }
    };
  } catch (error: any) {
    console.error("Firebase Email Signup failed:", error);
    throw error;
  }
};

export const loginUserWithEmail = async (email: string, password: string) => {
  if (isFirebasePlaceholder || !firebaseAuth) {
    // Standalone Sandbox Login
    const userStorageKey = "dezmils_users";
    let storedUsers: any[] = [];
    try {
      const stored = localStorage.getItem(userStorageKey);
      storedUsers = stored ? JSON.parse(stored) : [];
    } catch {}

    const foundTarget = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!foundTarget) {
      throw new Error("No sandbox account found with this email. Click register to create one.");
    }

    if (foundTarget.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    return {
      success: true,
      mode: 'sandbox',
      user: {
        id: foundTarget.id,
        email: foundTarget.email,
        displayName: foundTarget.displayName
      }
    };
  }

  try {
    // Real Firebase Authentication
    const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return {
      success: true,
      mode: 'live',
      user: {
        id: response.user.uid,
        email: response.user.email || '',
        displayName: response.user.displayName || 'Authorized Scholar'
      }
    };
  } catch (error: any) {
    console.error("Firebase login attempt failed:", error);
    throw error;
  }
};

export const logoutCurrentUser = async () => {
  if (!isFirebasePlaceholder && firebaseAuth) {
    try {
      await signOut(firebaseAuth);
    } catch (e) {
      console.error("Error signing out from Live Firebase:", e);
    }
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: firebaseAuth?.currentUser?.uid,
      email: firebaseAuth?.currentUser?.email,
      emailVerified: firebaseAuth?.currentUser?.emailVerified,
      isAnonymous: firebaseAuth?.currentUser?.isAnonymous,
      tenantId: firebaseAuth?.currentUser?.tenantId,
      providerInfo: firebaseAuth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Generic helper is utilized to save or load student progress from Firestore/Local storage
export const saveCloudStudentProgress = async (userId: string, progressData: any) => {
  const isSandboxUser = userId.startsWith('usr-') || !firebaseAuth?.currentUser || firebaseAuth.currentUser.uid !== userId;
  if (isFirebasePlaceholder || !firestoreDb || isSandboxUser) {
    // Local storage only
    localStorage.setItem(`dezmils_progress_${userId}`, JSON.stringify(progressData));
    return;
  }

  const path = `progress/${userId}`;
  try {
    const docRef = doc(firestoreDb, 'progress', userId);
    await setDoc(docRef, {
      ...progressData,
      lastActiveDate: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Failed to commit progress to Firestore, attempting fallback:", error);
    // Gracefully fallback
    localStorage.setItem(`dezmils_progress_${userId}`, JSON.stringify(progressData));
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const fetchCloudStudentProgress = async (userId: string) => {
  const isSandboxUser = userId.startsWith('usr-') || !firebaseAuth?.currentUser || firebaseAuth.currentUser.uid !== userId;
  if (isFirebasePlaceholder || !firestoreDb || isSandboxUser) {
    try {
      const stored = localStorage.getItem(`dezmils_progress_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  const path = `progress/${userId}`;
  try {
    const docRef = doc(firestoreDb, 'progress', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch progress from Firestore, falling back to local storage:", error);
    try {
      const stored = localStorage.getItem(`dezmils_progress_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    handleFirestoreError(error, OperationType.GET, path);
  }
};
