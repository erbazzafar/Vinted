
// import axios from 'axios';
// import Cookies from 'js-cookie';
// // Base API URL
// const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// // Get auth token from localStorage
// const getAuthToken = () => Cookies.get('token');

// // Create auth header
// const authHeader = () => ({
//   headers: {
//     'Authorization': `Bearer ${getAuthToken()}`
//   }
// });

// // Get the onboarding step directly from localStorage
// export const getOnboardingStep = (): string => {
//   return localStorage.getItem('onboarding_current_step') || 'congratulations';
// };

// // Check if onboarding is completed
// export const isOnboardingCompleted = (): boolean => {
//   return localStorage.getItem('onboarding_completed') === 'true';
// };

// // Mark onboarding as completed
// export const completeOnboarding = async (): Promise<void> => {
//   localStorage.setItem('onboarding_completed', 'true');

//   try {
//     // Also update the server
//     await axios.post(
//       `${API_URL}/auth/complete-onboarding`,
//       {},
//       authHeader()
//     );
//   } catch (error) {
//     console.error('Error marking onboarding as completed on server:', error);
//   }
// };

// // Set the onboarding step in localStorage - simplified implementation
// export const setOnboardingStep = (step: string): void => {
//   localStorage.setItem('onboarding_current_step', step);
// };

// // Reset onboarding answers but preserve current step
// export const resetOnboarding = (): void => {
//   // Remove all specific onboarding data
//   localStorage.removeItem('onboarding_revenue');
//   localStorage.removeItem('onboarding_visitor_conversion');
//   localStorage.removeItem('onboarding_obstacle');
//   localStorage.removeItem('onboarding_extra_revenue');
// };

// // Save all onboarding data to the database
// export const saveOnboardingData = async (): Promise<{ success: boolean; message: string }> => {
//   try {
//     // Get all stored values, ensuring they're all treated as strings
//     const revenue = localStorage.getItem('onboarding_revenue') || '';
//     const visitorConversion = localStorage.getItem('onboarding_visitor_conversion') || '';
//     const buyingObstacles = localStorage.getItem('onboarding_obstacle') || '';
//     const extraRevenue = localStorage.getItem('onboarding_extra_revenue') || '';

//     // Create the onboarding data object with all values as strings
//     const onboardingData = {
//       revenue,
//       visitorConversion,
//       buyingObstacles,
//       extraRevenue
//     };

//     console.log('Sending onboarding data:', onboardingData);

//     const response = await axios.post(
//       `${API_URL}/revenue/onboarding`,
//       onboardingData,
//       authHeader()
//     );

//     if (response.data && response.data.status === 'success') {
//       return {
//         success: true,
//         message: 'Onboarding data saved successfully'
//       };
//     }

//     return {
//       success: false,
//       message: response.data?.message || 'Failed to save onboarding data'
//     };
//   } catch (error: any) {
//     console.error('Error saving onboarding data:', error);
//     return {
//       success: false,
//       message: error.response?.data?.message || 'Error saving onboarding data'
//     };
//   }
// };
