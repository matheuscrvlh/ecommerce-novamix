import { useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext } from './auth-context'

function decodeRole(token: string) {
    try {
        return jwtDecode<{ role: string }>(token).role
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const storedToken = localStorage.getItem('token')

    const [ token, setToken ] = useState<string | null>(storedToken);
    const [ role, setRole ] = useState<string | null>(storedToken ? decodeRole(storedToken) : null);

    function login(token: string) {
        localStorage.setItem('token', token)
        setToken(token);
        setRole(decodeRole(token));
    };

    function logout() {
        localStorage.removeItem('token')
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}