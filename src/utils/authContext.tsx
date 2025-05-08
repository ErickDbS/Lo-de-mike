import { createContext } from "react";
import { useLocalStorage } from "react-use";
export const AuthContext = createContext({});

export default function AuthContexProvider({ children }: any) {
    const [storage, setStorage] = useLocalStorage("UserData");

    return (
        <AuthContext.Provider value={{ storage, setStorage }}>
            {children}
        </AuthContext.Provider>
    );
}
