import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// Handle GitHub Pages redirect
const path = localStorage.getItem('path') || '/';
localStorage.removeItem('path');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/ReactGutenberg">
      <App defaultPath={path} />
    </BrowserRouter>
  </React.StrictMode>
);
