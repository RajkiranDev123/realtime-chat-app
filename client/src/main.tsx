// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// It takes your React app and attaches it to a real HTML element
// <div id="root"></div>
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  // “I am sure this value is not null or undefined.” ==> ! (Non-null assertion operator)
  <>
    {/* <StrictMode> */}

    <SocketProvider>
      <App />
      <Toaster closeButton position="top-center" />
    </SocketProvider>

    {/* </StrictMode>, */}
  </>,
);

// index.html
// <body>
//   <div id="root"></div>
//   <script type="module" src="/src/main.tsx"></script>
// </body>

// So type="module" = enable ES module behavior (import / export) for the script.

// ES = ECMAScript, the official standard for JavaScript.

// ES6 = ECMAScript 2015, a specific major version of that standard.

// ES modules (import / export) were introduced in ES6.
