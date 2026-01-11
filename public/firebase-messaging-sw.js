// Service Worker for Firebase Cloud Messaging (Background Notifications)
importScripts(
  "https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCN3VPANBnwvCdvwrRZXHcruHLo3rBt40k",
  authDomain: "affaredoro-cf2bb.firebaseapp.com",
  projectId: "affaredoro-cf2bb",
  storageBucket: "affaredoro-cf2bb.firebasestorage.app",
  messagingSenderId: "686051382788",
  appId: "1:686051382788:web:1503f2dde81ecb709c0751",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/logo.jpg",
    badge: "/logo.jpg",
    tag: payload.data?.type || "notification",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

