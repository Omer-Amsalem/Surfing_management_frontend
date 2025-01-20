import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './utils/router'
import { ToastContainer } from 'react-toastify'
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {

  return (
    <GoogleOAuthProvider clientId='950458481049-cjg24tnbqq1rtj94oeedt6ruc114si6f.apps.googleusercontent.com'>
      <ToastContainer theme='light'/>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
