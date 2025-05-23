import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import * as React from 'react'

// Точка входа в программу
createRoot(document.getElementById('root')).render(
  <ChakraProvider>
      <App />
  </ChakraProvider>
)
