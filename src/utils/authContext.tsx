import { createContext, useState, useEffect, ReactNode } from "react";

interface Auth {
    user: { username: string; role: string } | null;
    login: (userData: { username: string; role: string }) => void;
    logout: () => void;
}

export const AuthContext = createContext<Auth>({
    user: null,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<{ username: string; role: string } | null>(
        () => {
            const stored = localStorage.getItem("UserData");
            return stored ? JSON.parse(stored) : null;
        }
    );

    const login = (userData: { username: string; role: string }) => {
        localStorage.setItem("UserData", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("UserData");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
