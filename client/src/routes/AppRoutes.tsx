import { Routes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/login/Login'
import Dashboard from '../pages/dashboard/Dashboard'
import Pedidos from '../pages/pedidos/Pedidos'
import Users from '../pages/users/Users'
import Collector from '../pages/collector/Collector'
import ColetaCracha from '../pages/coleta-cracha/ColetaCracha'
import Conta from '../pages/conta/Conta'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

function RootRedirect() {
  const { token, role } = useAuth()

  if (!token) {
    return <Navigate to='/login' replace />
  }

  return <Navigate to={role === 'ADMIN' ? '/dashboard' : '/collector'} replace />
}

export default function AppRoutes() {

  return (
    <Routes>
      <Route path='/login' element={ <Login /> }/>

      <Route element={ <ProtectedRoute allowedRoles={['ADMIN']} /> }>
        <Route path='/usuarios' element={ <Users /> }/>
        <Route path='/coleta-cracha' element={ <ColetaCracha /> }/>
      </Route>

      <Route element={ <ProtectedRoute allowedRoles={['OPERADOR', 'ADMIN']} /> }>
        <Route path='/dashboard' element={ <Dashboard /> }/>
        <Route path='/pedidos' element={ <Pedidos /> }/>
        <Route path='/collector' element={ <Collector /> }/>
        <Route path='/conta' element={ <Conta /> }/>
      </Route>

      <Route path='/' element={ <RootRedirect /> }/>
      <Route path='*' element={ <RootRedirect /> }/>
    </Routes>
  )
}