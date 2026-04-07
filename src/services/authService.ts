// src/services/authService.ts
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { AppUser } from "../types";

// ─── Sign In ─────────────────────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<AppUser> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(credential.user.uid);
    return profile;
  } catch (error: any) {
    throw new Error(mapAuthError(error.code));
  }
}

// ─── Sign Out ────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error("Failed to sign out. Please try again.");
  }
}

// ─── Fetch Firestore user profile ────────────────────────────────────────────
export async function fetchUserProfile(uid: string): Promise<AppUser> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("User profile not found. Contact your administrator.");
  }

  const data = snap.data();
  return {
    id: snap.id,
    email: data.email ?? "",
    fullName: data.fullName ?? "",
    role: data.role ?? "Worker",
    avatarUrl: data.avatarUrl ?? undefined,
    siteIds: data.siteIds ?? [],
  };
}

// ─── Create / seed a user profile (admin utility) ────────────────────────────
export async function createUserProfile(
  uid: string,
  profile: Omit<AppUser, "id">
): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...profile, createdAt: serverTimestamp() }, { merge: true });
}

// ─── Auth state listener ─────────────────────────────────────────────────────
/** Subscribe to auth changes. Returns unsubscribe function. */
export function onAuthChange(
  callback: (user: AppUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    try {
      const profile = await fetchUserProfile(firebaseUser.uid);
      callback(profile);
    } catch {
      callback(null);
    }
  });
}

// ─── Map Firebase error codes to user-friendly messages ──────────────────────
function mapAuthError(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Authentication failed. Please try again.";
  }
}
