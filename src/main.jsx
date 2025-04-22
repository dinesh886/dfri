import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Make sure to import any required global styles

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
