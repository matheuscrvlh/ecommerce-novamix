import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import { UsuariosProvider } from "./context/UsuariosContext"
import { UsuariosResumoProvider } from "./context/UsuariosResumoContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <UsuariosResumoProvider>
          <UsuariosProvider>
            <AppRoutes />
          </UsuariosProvider>
        </UsuariosResumoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
