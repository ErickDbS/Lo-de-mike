import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/home";
import Settings from "./pages/Settings/settings";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reports from "./pages/reports/reports";
import History from "./pages/history/History";
import HomeAdmin from "./pages/Home/homeAdmin";
import ProtectedRoute from "./utils/protectedRoute";
import Layout from "./pages/layout/layout";
import { useContext } from "react";
import { AuthContext } from "./utils/authContext";
export default function AppRoutes() {
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext.storage.role;
    const isAuthenticated = () => {
        if (authContext.storage !== undefined || authContext.storage !== null) {
            return true;
        }
        return false;
    };
    return (
        <>
            <Routes>
                <Route
                    element={
                        <ProtectedRoute
                            canActivate={isAuthenticated()}
                            redirectPath="/home"
                        />
                    }
                >
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route
                    element={<ProtectedRoute canActivate={isAuthenticated()} />}
                >
                    <Route path="/" element={<Layout />}>
                        <Route
                            path="/home"
                            element={userRole === 4 ? <HomeAdmin /> : <Home />}
                        />
                        <Route path="/history" element={<History />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}
