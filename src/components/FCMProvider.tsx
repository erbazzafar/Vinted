"use client";

import { useEffect } from "react";
import { registerServiceWorker, setupForegroundMessageListener, requestFCMToken } from "@/lib/fcm-utils";
import Cookies from "js-cookie";
import axios from "axios";

export default function FCMProvider() {
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Register service worker
        await registerServiceWorker();

        // Setup foreground message listener
        setupForegroundMessageListener();

        // Request FCM token
        const token = await requestFCMToken();
        
        if (token) {
          // Save token to backend if user is logged in
          const userToken = Cookies.get("user-token");
          const userId = Cookies.get("userId");
          
          if (userToken && userId) {
            try {
              await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${userId}`,
                { fcmToken: token },
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              );
              console.log("FCM token saved to backend");
            } catch (error) {
              console.error("Error updating FCM token:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing FCM:", error);
      }
    };

    // Only initialize in browser
    if (typeof window !== "undefined") {
      initializeFCM();
    }
  }, []);

  return null; // This component doesn't render anything
}

