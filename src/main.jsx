import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { LeadProvider } from './context/LeadContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <LeadProvider>
          <App />
        </LeadProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
