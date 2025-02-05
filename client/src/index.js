import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import SocketProvider from './SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);