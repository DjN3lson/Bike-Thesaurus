import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './css/index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className='container'>
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
