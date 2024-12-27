// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Register PWA
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    try {
      // This will be defined when the Vite PWA plugin injects the register code
      if (import.meta.env.DEV) {
        console.log('Service Worker registration skipped in development mode');
      } else {
        const { registerSW } = await import('virtual:pwa-register');
        registerSW({
          onRegistered(registration) {
            console.log('SW Registered:', registration);
          },
          onRegisterError(error) {
            console.log('SW registration error', error);
          }
        });
      }
    } catch (e) {
      console.log('Error registering service worker:', e);
    }
  });
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)