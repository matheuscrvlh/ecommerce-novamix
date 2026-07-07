import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import { UsuariosProvider } from "./context/UsuariosContext"

function App() {

  return (
    <AuthProvider>
      <UsuariosProvider>
        <AppRoutes />
      </UsuariosProvider>
    </AuthProvider>
  )
}

export default App
