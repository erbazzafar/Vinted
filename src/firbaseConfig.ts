import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

// Firebase Config for FCM Notifications (affaredoro-cf2bb)
const firebaseConfig = {
  apiKey: "AIzaSyCN3VPANBnwvCdvwrRZXHcruHLo3rBt40k",
  authDomain: "affaredoro-cf2bb.firebaseapp.com",
  projectId: "affaredoro-cf2bb",
  storageBucket: "affaredoro-cf2bb.firebasestorage.app",
  messagingSenderId: "686051382788",
  appId: "1:686051382788:web:1503f2dde81ecb709c0751",
  measurementId: "G-XNVXN3GLTL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

// Initialize messaging (only in browser environment)
let messaging: Messaging | null = null;

// Function to get messaging instance (handles async initialization)
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (messaging) {
    return messaging;
  }

  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      return messaging;
    }
  } catch (error) {
    console.error("Firebase messaging not supported:", error);
  }

  return null;
};

export { auth, provider, signInWithRedirect, getToken, onMessage };
