import './App.css'
import LoginPage from './pages/LogInPage'
import { BrowserRouter } from 'react-router-dom'
import Router from './utils/router'

function App() {

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
