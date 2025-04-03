import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDS0irfT1ol6u9PFvYaEEVi8WTOp6sopzM",
    authDomain: "affare-doro.firebaseapp.com",
    projectId: "affare-doro",
    storageBucket: "affare-doro.firebasestorage.app",
    messagingSenderId: "310039757931",
    appId: "1:310039757931:web:79fc22ca81cb85ae155d2e",
    measurementId: "G-C5MP9EVT9X"
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  export { auth, provider, signInWithRedirect };