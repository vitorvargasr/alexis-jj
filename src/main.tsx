import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './main.css'

// Test macro
import alexisRaw from '@/assets/alexis-jj-8e2b0.jpeg?raw'
console.log('alexisRaw length:', alexisRaw.length)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
