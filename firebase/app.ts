import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firestore = getFirestore(app);
export const storage = getStorage(app);
// export const analytics = getAnalytics(app);
