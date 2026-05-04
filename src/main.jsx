import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InventarioProvider } from "./context/InventarioContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <InventarioProvider>
      <App />
    </InventarioProvider>
  </StrictMode>
);