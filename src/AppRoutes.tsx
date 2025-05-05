import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout/layout";
import Home from "./pages/Home/home";
import Settings from "./pages/Settings/settings";
import Prueba from "./components/schedule/Prueba";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Reports from "./pages/reports/reports";
import History from "./pages/history/History";
import HomeAdmin from "./pages/Home/homeAdmin";
import Schedule from "./pages/Schedules/Schedule";

const userRole: string = "jefeCarrera";

export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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
                    <Route path="/schedules" element={<Schedule />} />
                </Route>
                <Route path="/prueba" element={<Prueba />} />

            </Routes>
        </>
    );
}
