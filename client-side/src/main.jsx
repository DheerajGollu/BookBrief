import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles/style.css'
import Axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import 'bootstrap-icons/font/bootstrap-icons.css';

Axios.defaults.baseURL = "http://localhost:8080" // This is the backend URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
