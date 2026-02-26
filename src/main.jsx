import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// On every load, fetch version.json directly from the network (bypassing
// browser cache). If the deploy version is newer than what we last saw,
// reload the page so the browser discards its stale index.html + JS bundle.
const VERSION_KEY = "cd_deploy_version";
async function checkVersion() {
  try {
    const res = await fetch("/version.json", { cache: "no-store" });
    if (!res.ok) return;
    const { v } = await res.json();
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored && stored !== String(v)) {
      localStorage.setItem(VERSION_KEY, String(v));
      window.location.reload();
    } else {
      localStorage.setItem(VERSION_KEY, String(v));
    }
  } catch {
    // Network unavailable — don't block the app.
  }
}

checkVersion();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
