import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure the DOM is loaded before rendering
document.addEventListener("DOMContentLoaded", function () {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Root element not found!");
  }
});
