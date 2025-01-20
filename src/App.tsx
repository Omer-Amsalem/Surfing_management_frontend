import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './utils/router'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {

  return (
    <GoogleOAuthProvider clientId={process.env.clientId?.toString() || ''}>
      <ToastContainer theme='light'/>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
