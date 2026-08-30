import React from 'react';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import MainApp from './components/MainApp';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;