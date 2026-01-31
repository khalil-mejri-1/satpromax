import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from "react-helmet-async";

const GOOGLE_CLIENT_ID = "1009149258614-fi43cus8mt3j8gcfh7d4jlnk1d05hajg.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
