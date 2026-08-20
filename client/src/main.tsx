// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// It takes your React app and attaches it to a real HTML element
// <div id="root"></div>
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  // “ I am sure this value is not null or undefined ” ==> ! (Non-null assertion operator)
  
  // as → type assertion syntax in TypeScript.
  // ! → non-null assertion operator in TypeScript.
  <>
    {/* <StrictMode> */}

    <SocketProvider>
      <App />
      <Toaster closeButton position="top-center" />
    </SocketProvider>

    {/* </StrictMode>, */}
  </>,
);

// client/index.html ==>

// <body>
//   <div id="root"></div>
//   <script type="module" src="/src/main.tsx"></script>
// </body>

// So type="module" = enable ES module behavior (import / export) for the script.

// ECMAScript/ES = rulebook / standard / specification ==> let , const etc
// JavaScript = language that follows the rulebook  ==> Chrome → V8

// ES6 = ECMAScript 2015, a specific major version of that standard , (Modules ==> import / export , let and const , arrow fun etc) were introduced in ES6.
