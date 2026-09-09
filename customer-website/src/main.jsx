import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const isLocalPreviewHost =
      window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";

    if (import.meta.env.DEV || isLocalPreviewHost) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      console.warn("Service worker registration failed");
    });
  });
}
