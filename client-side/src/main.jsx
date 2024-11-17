import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles/style.css'
import Axios from 'axios'

Axios.defaults.baseURL = "http://localhost:8080" // This is the backend URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
