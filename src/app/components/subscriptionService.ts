
import axios from 'axios';
import Cookies from 'js-cookie';
import { completeOnboarding } from './onboardingService';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';

const getToken = () => {
  return Cookies.get('token');
};

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// Create setup intent for saving card without immediate charge
export const setupPaymentMethod = async (planId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions/setup-payment-method`,
      { planId },
      { headers: headers() }
    );
    
    // Get user email from response and store it
    if (response.data.userEmail) {
      localStorage.setItem('userEmail', response.data.userEmail);
    }
    
    return response.data;
  } catch (error: any ) {
    throw error.response?.data || { message: 'Error setting up payment method' };
  }
};

// Process the result of a successful card setup
export const processCardSetup = async (setupIntentId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions/process-setup-result`,
      { setupIntentId },
      { headers: headers() }
    );
    
    // Mark onboarding as completed
    await completeOnboarding();
    
    return response.data;
  } catch (error:any) {
    throw error.response?.data || { message: 'Error processing card setup' };
  }
};

// Get current subscription details
export const getCurrentSubscription = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/subscriptions/current`,
      { headers: headers() }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error fetching subscription' };
  }
};

// End trial and start regular billing
export const endTrialStartBilling = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions/end-trial`,
      {},
      { headers: headers() }
    );
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error ending trial' };
  }
};

// Record an AI interaction (decrements the counter)
export const recordAIInteraction = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions/record-interaction`,
      {},
      { headers: headers() }
    );
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error recording AI interaction' };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions/cancel/${subscriptionId}`,
      {},
      { headers: headers() }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error canceling subscription' };
  }
};

// Handle redirect from Stripe setup (for older flow - can be removed if not used)
export const handleStripeRedirect = async () => {
  // Extract the setup_intent from the URL if it exists
  const urlParams = new URLSearchParams(window.location.search);
  const setupIntentId = urlParams.get('setup_intent');
  
  if (setupIntentId) {
    try {
      // Process the setup intent
      const result = await processCardSetup(setupIntentId);
      
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error handling Stripe redirect:', error);
      return { success: false, error: 'Failed to process setup result' };
    }
  }
  
  return { success: false, noSession: true };
};
