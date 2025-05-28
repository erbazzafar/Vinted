// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyDS0irfT1ol6u9PFvYaEEVi8WTOp6sopzM",
//     authDomain: "affare-doro.firebaseapp.com",
//     projectId: "affare-doro",
//     storageBucket: "affare-doro.firebasestorage.app",
//     messagingSenderId: "310039757931",
//     appId: "1:310039757931:web:79fc22ca81cb85ae155d2e",
//     measurementId: "G-C5MP9EVT9X"
//   };


//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);
//   const provider = new GoogleAuthProvider();

//   export { auth, provider, signInWithRedirect };


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDS0irfT1ol6u9PFvYaEEVi8WTOp6sopzM",
//   authDomain: "affare-doro.firebaseapp.com",
//   projectId: "affare-doro",
//   storageBucket: "affare-doro.firebasestorage.app",
//   messagingSenderId: "310039757931",
//   appId: "1:310039757931:web:79fc22ca81cb85ae155d2e",
//   measurementId: "G-C5MP9EVT9X"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDS0irfT1ol6u9PFvYaEEVi8WTOp6sopzM",
  authDomain: "affare-doro.firebaseapp.com",
  projectId: "affare-doro",
  storageBucket: "affare-doro.appspot.com",
  messagingSenderId: "310039757931",
  appId: "1:310039757931:web:79fc22ca81cb85ae155d2e",
  measurementId: "G-C5MP9EVT9X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };