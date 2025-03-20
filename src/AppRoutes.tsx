import { Route, Routes } from "react-router-dom";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Inicio from "./Inicio";
import Schedule from "./Components/schedule/Schedule";
import Prueba from "./Components/schedule/prueba";

export default function AppRoutes(){
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/prueba" element={<Prueba />}/>
            </Routes>
        </>
    )
}