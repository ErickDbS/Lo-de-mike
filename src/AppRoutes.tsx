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

const userRole: string = "admin";
console.log(localStorage.getItem("UserData"));

const isAuthenticated = () => {
    if (localStorage.getItem("UserData") !== null) {
        return true;
    }
    return false;
};

export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route
                    element={
                        <ProtectedRoute
                            canActivate={!isAuthenticated()}
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
                            element={
                                userRole === "admin" ? <HomeAdmin /> : <Home />
                            }
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
