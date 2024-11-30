import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import './styles/global.css'
import './styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
