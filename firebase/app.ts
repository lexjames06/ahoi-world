import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

if (shouldUseEmulator()) {
  try {
    connectAuthEmulator(auth, getAuthEmulatorHost());
    connectFirestoreEmulator(firestore, host, getFirestoreEmulatorPort());
    connectStorageEmulator(storage, host, getStorageEmulatorPort());
  } catch (error) {
    console.log({error});
  }
}
// export const analytics = getAnalytics(app);

function shouldUseEmulator() {
  return process.env.NODE_ENV === "development";
}

function getFirestoreEmulatorPort() {
  return parseInt(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT);
}

function getStorageEmulatorPort() {
  return parseInt(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT);
}

function getAuthEmulatorHost() {
  const port = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;
  return `http://${host}:${port}`;
}