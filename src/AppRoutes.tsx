import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login-Register/Login";
import Register from "./Components/Login-Register/Register";
import Inicio from "./Inicio";

export default function AppRoutes(){
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    )
}