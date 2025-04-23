import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// ✅ Import GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <GoogleOAuthProvider clientId="394012589587-fvrpg82okjfr3cp9q0o1th8kc7ic0fqj.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
