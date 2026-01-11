"use client";

import { getMessagingInstance, getToken, onMessage } from "@/firbaseConfig";

// VAPID key - Firebase Console se copy karein (Cloud Messaging > Web Push certificates)
// Note: Yeh key Firebase Console se generate karni hogi
// Add this to your .env file: NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// FCM Token request karein
export const requestFCMToken = async (): Promise<string | null> => {
    try {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return null;
        }

        // Get messaging instance
        const messaging = await getMessagingInstance();
        if (!messaging) {
            console.log("Firebase messaging is not available");
            return null;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            // Get FCM token
            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
            });

            if (token) {
                console.log("FCM Token:", token);
                return token;
            } else {
                console.log("No registration token available.");
                return null;
            }
        } else {
            console.log("Notification permission denied");
            return null;
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
        return null;
    }
};

// Foreground messages ke liye listener
export const setupForegroundMessageListener = async () => {
    const messaging = await getMessagingInstance();
    if (!messaging) {
        console.log("Firebase messaging is not available");
        return;
    }

    onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);

        // Show notification
        if (Notification.permission === "granted") {
            const notificationTitle = payload.notification?.title || "New Notification";
            const notificationOptions = {
                body: payload.notification?.body || "",
                icon: payload.notification?.icon || "/logo.jpg",
                badge: "/logo.jpg",
                tag: payload.data?.type || "notification",
                data: payload.data,
            };

            new Notification(notificationTitle, notificationOptions);
        }
    });
};

// Service worker registration helper
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        console.log("Service Worker is not supported");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registered:", registration);
        return registration;
    } catch (error) {
        console.log("Service Worker registration failed:", error);
        return null;
    }
};

