import { createRoot } from "react-dom/client";

// Extremely simple React app for testing
function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦷 MxSmiles</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Save 40-70% on Dental Care in Mexico</p>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <strong>✅ React App Successfully Loaded!</strong>
          <br />
          <small>The frontend is working correctly.</small>
        </div>
        <button 
          onClick={() => alert('Button clicked! React events are working.')}
          style={{
            background: '#64A8F0',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

// Add loading indicator immediately
const rootElement = document.getElementById("root");
if (rootElement) {
  rootElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif;"><div style="text-align: center;"><div style="margin-bottom: 16px;">Loading Simple Test...</div><div style="width: 32px; height: 32px; border: 3px solid #f3f3f3; border-top: 3px solid #64A8F0; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div></div></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>';
  
  try {
    console.log('Attempting to create React root...');
    const root = createRoot(rootElement);
    console.log('React root created successfully');
    
    console.log('Attempting to render React app...');
    root.render(<SimpleApp />);
    console.log('React app rendered successfully');
    
  } catch (error) {
    console.error('Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="text-align: center; max-width: 500px; padding: 2rem;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">React Loading Error</h1>
          <p style="color: #6b7280; margin-bottom: 1rem;">Unable to load the React application.</p>
          <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; font-family: monospace; font-size: 0.875rem; text-align: left; color: #374151;">
            ${error}
          </div>
          <button onclick="window.location.reload()" style="background: #64A8F0; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">Refresh Page</button>
        </div>
      </div>
    `;
  }
} else {
  console.error('Root element not found');
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
      <div style="text-align: center; max-width: 500px; padding: 2rem;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Critical Error</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">No root element found in DOM. The HTML structure may be corrupted.</p>
        <button onclick="window.location.reload()" style="background: #64A8F0; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">Refresh Page</button>
      </div>
    </div>
  `;
}