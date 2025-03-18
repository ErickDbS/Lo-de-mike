import { Link } from "react-router-dom"
import { Eye, EyeOff, CalendarDays } from "lucide-react"
import { useState } from "react"

export default function Login(){
    const [showPassword, setShowPassword] = useState(false)
    return (
        <>
            <div className="bg-gradient-to-t from-white to-blue-500 min-h-screen flex flex-col justify-center items-center relative">

                {/* Logo en la parte superior izquierda */}
                <div className="absolute top-4 left-4 flex items-center">
                    <CalendarDays className="text-white h-10 w-10" />
                    <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
                </div>

                <form className="grid gap-4 border-4 w-96 p-6 bg-white shadow-md rounded-md border-blue-500">
                    <label className="grid text-4xl place-items-center">Iniciar Sesion</label>
                    <label className="text-xl font-bold">Correo</label>
                    <input 
                        type="email" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic"
                        placeholder="Nombre@hotmail.com"
                        required
                        />
                    <label className="text-xl font-bold">Contraseña</label>
                <div className="relative w-80">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10"
                        required
                        placeholder="******"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                    <button 
                        className="text-white rounded-md bg-blue-500 mt-5 py-2 hover:bg-blue-700"
                        >
                        Iniciar Sesión
                    </button>
                    <label className="grid place-items-center">O</label>
                    <Link 
                        to={"/register"}
                        className="text-lg grid place-items-center text-blue-500 hover:text-blue-700"
                        >
                        Crea una cuenta
                    </Link>
                </form>
            </div>
        </>
    )
}