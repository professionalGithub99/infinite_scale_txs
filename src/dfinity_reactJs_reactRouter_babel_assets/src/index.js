import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ThemeProvider } from './context/theme';
import ErrorBoundary from './components/error_boundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('app')
);