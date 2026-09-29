import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o Service Worker apenas em produção fora do ambiente de desenvolvimento (evita interferir no HMR e preview dev)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('ServiceWorker registrado com sucesso:', reg.scope)
      })
      .catch((err) => {
        console.error('Falha ao registrar ServiceWorker:', err)
      })
  })
}
