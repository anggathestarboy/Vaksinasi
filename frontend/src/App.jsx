import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'react-router-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateConsultation from './pages/CreateConsultation'
import Vacination from './pages/Vacination'
import ShowVacination from './pages/ShowVacination'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLogin from './components/ProtectedLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedLogin> <Login/></ProtectedLogin> } />
        <Route path='/dashboard' element={ <ProtectedRoute><Dashboard/></ProtectedRoute> } />
        <Route path='/consultation' element={<ProtectedRoute> <CreateConsultation/></ProtectedRoute> } />
        <Route path='/vaccination' element= {<ProtectedRoute><Vacination/></ProtectedRoute> } />
        <Route path='/vaccination/:spotId' element={<ProtectedRoute><ShowVacination/></ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
   
   </>
  )
}

export default App
