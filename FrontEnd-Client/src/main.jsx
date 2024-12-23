import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './css/main.css'
import Index from './index.jsx'
import { BrowserRouter, Link } from 'react-router-dom'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className='container' >
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
)


