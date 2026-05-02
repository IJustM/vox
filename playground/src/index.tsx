import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { vox } from "../../src";

vox();

createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    
  </StrictMode>,
);
