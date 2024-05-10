import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Your App component
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18next';
function Root() {
  return (
    <Router>
       <I18nextProvider i18n={i18n}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
      </I18nextProvider>
    </Router>
  );
}

export default Root;
