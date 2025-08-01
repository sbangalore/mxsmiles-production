import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add loading indicator immediately
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif;"><div style="text-align: center;"><div style="margin-bottom: 16px;">Loading MxSmiles...</div><div style="width: 32px; height: 32px; border: 3px solid #f3f3f3; border-top: 3px solid #64A8F0; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div></div></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>';
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error('Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="text-center; max-width: 500px; padding: 2rem;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Loading Error</h1>
          <p style="color: #6b7280; margin-bottom: 1rem;">Unable to load the application. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" style="background: #64A8F0; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">Refresh Page</button>
          <div style="margin-top: 1rem; font-size: 0.875rem; color: #9ca3af;">Error: ${error}</div>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
