import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './Root';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import {Provider} from 'react-redux';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
// In your main index.js or App.js file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      console.error('Service Worker registration failed: ', err);
    });
}
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <Root />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

