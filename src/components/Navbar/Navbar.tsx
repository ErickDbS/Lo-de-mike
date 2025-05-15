import { Bell, CalendarDays, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../utils/authContext";
import { useContext } from "react";

// 1. Definir tipo para los roles
type UserRole = 1 | 2 | 3 | 4;

export default function Navbar() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext) as any;
    // 3. Asegurar el tipo con aserción
    const userRole = authContext.storage.role as UserRole;

    // 2. Tipar navOptions con Record<UserRole>
    const navOptions: Record<
        UserRole,
        Array<{ path: string; label: string; title: string }>
    > = {
        1: [
            {
                path: "/history",
                label: "Historial de Clases",
                title: "Ver las clases pasadas y asistencia del profesores.",
            },
            {
                path: "/assists",
                label: "Asistencias de los profesores",
                title: "Marcar asistencias de los profesores.",
            },
        ],
        2: [
            {
                path: "/history",
                label: "Mi Historial",
                title: "Ver todas sus asistencias y reportes.",
            },
        ],
        3: [
            {
                path: "/schedules",
                label: "Horarios",
                title: "Ver horarios con la opción de crear, eliminar, editar.",
            },
        ],
        4: [
            {
                path: "",
                label: "Opciones de jef@ de carrera",
                title: "",
            },
        ],
    };

    const userTypes = {
        1: "Jef@ de grupo",
        2: "Maestr@",
        3: "Checador@",
        4: "Jef@ de carrera",
    };

    const logOut = () => {
        Swal.fire({
            title: "¿Está seguro que desea salir?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                authContext.setStorage(undefined);
                localStorage.removeItem("UserData");
                localStorage.removeItem("group_name");
                localStorage.removeItem("aula_del_grupo");
                navigate("/");
            }
        });
    };

    return (
        <nav className="h-16 w-full bg-blue-800 flex flex-row justify-between items-center px-20">
            <div className="flex flex-row items-center">
                <Link
                    to="/home"
                    className="flex flex-row items-center justify-center"
                >
                    <CalendarDays className="text-white h-10 w-10" />
                    <h1 className="text-white text-2xl ml-2">
                        Mike's Schedules
                    </h1>
                </Link>
                {/* data user */}
                <div className="border-x border-gray-300/20 px-3 ml-4">
                    <p className="text-lg text-white mb-0.5 font-medium">
                        {`${authContext.storage.name} ${authContext.storage.lastname}`}
                    </p>
                    <p className="text-base text-[#a3b5c5] -mt-2 italic">
                        {authContext.storage.username}
                    </p>
                </div>

                <p className="text-lg text-white p-2">{userTypes[userRole]}</p>
            </div>

            <div className="flex space-x-6 text-white font-semibold items-center justify-center">
                <Link
                    className="group relative inline-block text-white h-6"
                    to="/home"
                >
                    Inicio
                    <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Mapeo seguro gracias a la tipificación */}
                {navOptions[userRole].map((option) => (
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
                    <a
                        className="hover:font-bold duration-100 ease-in p-2 cursor-pointer"
                        title="Cerrar Sesión"
                        onClick={logOut}
                    >
                        <LogOut className="w-6 h-6 stroke-current text-white transition duration-500 hover:text-red-500" />
                    </a>
                </div>
            </div>
        </nav>
    );
}
