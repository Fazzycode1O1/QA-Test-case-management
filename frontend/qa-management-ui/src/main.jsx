import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            },
            success: { iconTheme: { primary: '#0f766e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
