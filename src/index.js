import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./Root";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as Sentry from "@sentry/react";   

// Sentry init (ADD)
Sentry.init({
  dsn: "https://ebc4f2c44dacb64b05e3d3b72dc0beb8@o4510837986164736.ingest.us.sentry.io/4510837992914944",
  integrations: [Sentry.browserTracingIntegration(), Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
],

  tracesSampleRate: 1.0,
   tracePropagationTargets: [
    "localhost",
    "www.thecoverkraft.com"
    // /^https:\/\/api\.thecoverkraft\.com/
  ],
});

const root = ReactDOM.createRoot(document.getElementById("root"));
const observerErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
  }
};

window.addEventListener('error', observerErrorHandler);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
