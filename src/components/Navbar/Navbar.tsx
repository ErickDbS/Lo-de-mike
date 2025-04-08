import { Bell, CalendarDays, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const userRole = "maestro";

    // Opciones de navegación basadas en el rol
    const navOptions = {
        jefe: [
            {
                path: "/history",
                label: "Historial de Clases",
                title: "Ver las clases pasadas y asistencia del profesor.",
            },
            {
                path: "/reports",
                label: "Lista de Reportes",
                title: "Lista de reportes hechos y su estado.",
            },
            // {
            //     path: "/edit",
            //     label: "Corregir Reportes",
            //     title: "Editar o corregir reportes incorrectos.",
            // },
        ],
        maestro: [
            {
                path: "/history",
                label: "Mi Historial",
                title: "Ver todas sus asistencias y reportes.",
            },
        ],
        checador: [
            {
                path: "/check",
                label: "Verificar Asistencia",
                title: "Consultar reportes de faltas y confirmarlos.",
            },
            {
                path: "/edit",
                label: "Corregir Reportes",
                title: "Editar o corregir reportes incorrectos.",
            },
            {
                path: "/general-reports",
                label: "Reportes Generales",
                title: "Acceso a estadísticas de asistencia.",
            },
        ],
    };

    return (
        <nav className="h-16 w-full bg-blue-800 flex flex-row justify-between items-center px-20">
            <Link
                to="/home"
                className="flex flex-row items-center justify-center"
            >
                <CalendarDays className="text-white h-10 w-10" />
                <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
            </Link>

            <div className="flex space-x-6 text-white font-semibold items-center justify-center">
                <Link
                    className="group relative inline-block text-white h-6"
                    to="/home"
                >
                    Inicio
                    <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Opciones según el rol */}
                {navOptions[userRole]?.map((option) => (
                    <Link
                        key={option.path}
                        className="group relative inline-block text-white h-6"
                        to={option.path}
                        title={option.title}
                    >
                        {option.label}
                        <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                ))}

                {/* Opciones generales */}
                <div className="flex flex-row border-l border-gray-300/20">
                    <Link
                        className="hover:font-bold duration-100 ease-in p-2"
                        to="/notifications"
                        title="Notificaciones"
                    >
                        <Bell className="w-5 h-5 fill-current text-white hover:text-green-400 transition duration-200" />
                    </Link>

                    <Link
                        className="hover:font-bold duration-100 ease-in p-2"
                        to="/settings"
                        title="Configuraciones"
                    >
                        <Settings className="w-6 h-6 stroke-2 stroke-current transition duration-500 hover:text-yellow-500" />
                    </Link>

                    <Link
                        className="hover:font-bold duration-100 ease-in p-2"
                        to="/logout"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-6 h-6 stroke-current text-white transition duration-500 hover:text-red-500" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
