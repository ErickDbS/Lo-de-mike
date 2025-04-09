import { Link } from "react-router-dom";
import { Eye, EyeOff, CalendarDays } from "lucide-react";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <nav className="h-16 w-full bg-blue-800 flex flex-row justify-left items-center px-20">
                <CalendarDays className="text-white h-10 w-10" />
                <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
            </nav>
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative">
                <form className="grid gap-4 border-4 w-96 p-6 bg-[#1e2022] shadow-md rounded-md border-[1px] border-gray-400">
                    <label className="grid text-4xl place-items-center text-blue-400">
                        Iniciar Sesion
                    </label>
                    <label className="text-xl font-bold text-white">
                        Correo
                    </label>
                    <input
                        type="email"
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic text-white"
                        placeholder="Nombre@hotmail.com"
                        required
                    />
                    <label className="text-xl font-bold text-white">
                        Contraseña
                    </label>
                    <div className="relative w-80">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-2 border rounded-md placeholder:text-gray-200 pr-10 text-white"
                            required
                            placeholder="******"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-white hover:text-gray-200 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    <button className="text-white rounded-md bg-blue-800 mt-5 py-2 hover:bg-blue-700 cursor-pointer">
                        Iniciar Sesión
                    </button>
                    <label className="grid place-items-center text-white">
                        O
                    </label>
                    <Link
                        to={"/register"}
                        className="text-lg grid place-items-center text-blue-400 hover:text-blue-700"
                    >
                        Crea una cuenta
                    </Link>
                </form>
            </div>
        </>
    );
}
