import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import { UsuariosProvider } from "./context/UsuariosContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <UsuariosProvider>
          <AppRoutes />
        </UsuariosProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
