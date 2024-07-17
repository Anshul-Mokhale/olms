import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { BookProvider } from './context/BookContext';
import { LogProvider } from './context/LogContext';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <LogProvider>
        <BookProvider>
          <Router>
            <App />
          </Router>
        </BookProvider>
      </LogProvider>
    </UserProvider>
  </React.StrictMode>,
);
