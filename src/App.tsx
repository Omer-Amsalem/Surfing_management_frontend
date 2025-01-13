import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Router from './utils/router'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
    <ToastContainer theme='light'/>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
    </>
  )
}

export default App
