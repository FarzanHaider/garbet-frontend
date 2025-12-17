// /**
//  * Main API instance with interceptors
//  * This file handles the axios instance setup and token refresh logic
//  */

// import axios from 'axios'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// // Create axios instance with credentials for httpOnly cookies
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Required for httpOnly cookies to be sent
// })

// // Flag to prevent multiple simultaneous refresh attempts
// let isRefreshing = false
// let failedQueue = []

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error)
//     } else {
//       prom.resolve(token)
//     }
//   })
//   failedQueue = []
// }

// // Request/Response interceptors for httpOnly cookie-based auth
// if (typeof window !== 'undefined') {
//   // Request interceptor - cookies are sent automatically, no need to add headers
//   api.interceptors.request.use((config) => {
//     // Cookies are automatically sent with withCredentials: true
//     // No need to manually add Authorization header
//     return config
//   })

//   // Response interceptor - handle token refresh on 401 errors
//   api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config

//       // If error is 401 and we haven't tried to refresh yet
//       // Don't intercept refresh-token endpoint to avoid infinite loop
//       if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
//         if (isRefreshing) {
//           // If already refreshing, queue this request
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject })
//           })
//             .then(token => {
//               originalRequest.headers.Authorization = `Bearer ${token}`
//               return api(originalRequest)
//             })
//             .catch(err => {
//               return Promise.reject(err)
//             })
//         }

//         originalRequest._retry = true
//         isRefreshing = true

//         try {
//           // Refresh token is automatically sent via httpOnly cookie
//           // No need to send it in request body
//           const response = await api.post('/auth/refresh-token')
          
//           // Tokens are set in httpOnly cookies by backend, no need to store
//           // Process queued requests (no token needed, cookies handle it)
//           processQueue(null, null)
//           isRefreshing = false

//           // Retry the original request (cookies are automatically sent)
//           return api(originalRequest)
//         } catch (refreshError) {
//           // Refresh failed, redirect to login
//           processQueue(refreshError, null)
//           isRefreshing = false
          
//           // Clear any remaining localStorage data (if any)
//           if (typeof window !== 'undefined') {
//             localStorage.removeItem('token')
//             localStorage.removeItem('accessToken')
//             localStorage.removeItem('refreshToken')
//             localStorage.removeItem('user')
//             window.location.href = '/auth/login'
//           }
//           return Promise.reject(refreshError)
//         }
//       }

//       return Promise.reject(error)
//     }
//   )
// }

// export default api

/**
 * Axios Instance With HttpOnly Cookies + Auto Refreshing
 */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://garbet-backend-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for receiving/sending httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------
// Refresh Token Handling Logic
// ---------------------------------------------

let isRefreshing = false;
let waitingRequests = [];

// Helper to process the queue once the token is refreshed
function resolveWaitingRequests() {
  waitingRequests.forEach((callback) => callback());
  waitingRequests = [];
}

api.interceptors.response.use(
  // Success path: just return the response
  (response) => response,
  
  // Error path: handle 401 Unauthorized
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/auth/login") // Don't refresh if login fails
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          waitingRequests.push(() => {
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the session
        await api.post("/auth/refresh-token");
        
        isRefreshing = false;
        resolveWaitingRequests();

        // Retry the original request that failed
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        waitingRequests = []; // Clear queue on failure

        // If refresh fails, the user session is dead. Redirect to login.
        if (typeof window !== "undefined") {
          localStorage.removeItem('user'); // Clean up local state
          localStorage.removeItem('isAdmin');
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // For all other errors (404, 500, etc.), just reject
    return Promise.reject(error);
  }
);

export default api;