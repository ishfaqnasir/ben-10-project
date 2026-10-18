import React from 'react'
import { HashRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './redesign.css'
import './profile.css'
import './gate.css'

createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><App /></HashRouter></React.StrictMode>)
