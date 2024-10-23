import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Navbar from './Navbar.tsx'
import './css/index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className='container'>
        <Navbar />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
