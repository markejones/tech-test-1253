import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
