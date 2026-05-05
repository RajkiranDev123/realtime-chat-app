import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// It takes your React app and attaches it to a real HTML element
// <div id="root"></div>
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    {/* <StrictMode> */}
    <App />
    <Toaster closeButton />
    {/* </StrictMode>, */}
  </>,
);
