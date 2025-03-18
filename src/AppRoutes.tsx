import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Layout from "./pages/layout/layout";
import Home from "./pages/Home/home";
import Settings from "./pages/Settings/settings";

export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Layout />}>
                    <Route path="/home" index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </>
    );
}
