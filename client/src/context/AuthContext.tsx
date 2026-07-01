import { createContext, useState} from 'react'
import { jwtDecode } from 'jwt-decode'

type AuthContextType = {
    token: string | null
    role: string | null
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [ token, setToken ] = useState<string | null>(null);
    const [ role, setRole ] = useState<string | null>(null);

    function login(token: string) {
        const decodedPayload = jwtDecode<{role: string}>(token);
        const decodedRole = decodedPayload.role

        setToken(token);
        setRole(decodedRole);
    }; 

    function logout() {
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}