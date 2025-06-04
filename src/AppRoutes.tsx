import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/home";
import Settings from "./pages/Settings/settings";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reports from "./pages/reports/reports";
import History from "./pages/history/History";
import HomeJefa from "./pages/Home/homeJefa";
import ProtectedRoute from "./utils/protectedRoute";
import Layout from "./pages/layout/layout";
import { useContext } from "react";
import { AuthContext } from "./utils/authContext";
import Schedule from "./pages/Schedules/Schedule";
import Assists from "./pages/assists/assists";
import Notifications from "./pages/Notifications/Notifications";

export default function AppRoutes() {
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext?.storage?.role;

    const isAuthenticated = () => {
        return authContext?.storage != null;
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    element={<ProtectedRoute canActivate={isAuthenticated()} />}
                >
                    <Route path="/" element={<Layout />}>
                        <Route
                            path="/home"
                            element={userRole === 4 ? <HomeJefa /> : <Home />}
                        />

                        <Route path="/schedules" element={<Schedule />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/assists" element={<Assists />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}
