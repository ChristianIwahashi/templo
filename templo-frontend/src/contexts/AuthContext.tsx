import { createContext, useEffect, useState, type ReactNode } from "react";
import { Api } from "../api/Api";

interface User {
    idUsuario: number;
    nome: string;
    email: string;
    papel: 'GESTOR' | 'PROFESSOR' | 'ALUNO';
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storagedUser = localStorage.getItem('@Templo:user');
        const storagedToken = localStorage.getItem('@Templo:token');

        if (storagedToken && storagedUser) {
            setUser(JSON.parse(storagedUser));
        }
    }, []);

    async function signIn(email: string, senha: string) {
        try {
            const response = await Api.post('/auth/login', { email, senha });

            const { access_token, usuario } = response.data;

            localStorage.setItem('@Templo:token', access_token);
            localStorage.setItem('@Templo:user', JSON.stringify(usuario));

            setUser(usuario);
        } catch (error) {
            console.error('Erro ao fazer login', error);
            throw error;
        }
    }

    function signOut() {
        localStorage.removeItem('@Templo:token');
        localStorage.removeItem('@Templo:user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}