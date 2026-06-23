import { Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'

export default function AppRoutes() {

  return (
    <Routes>
      <Route path='/Login' element={ <Login /> }/>
    </Routes>
  )
}