import { Link } from "react-router-dom"
import { useState } from "react"
import { Eye, EyeOff, CalendarDays } from "lucide-react"

export default function Register(){
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handlePassword = (value:string) => {
        setPassword(value)
        validatePasswords(value, confirmPassword)
    }

    const handleConfirmPassword = (value:string) => {
        setConfirmPassword(value)
        validatePasswords(password, value)
    }

    const validatePasswords = (password:string, confirmPassword:string) => {
        if (password != confirmPassword) {
            setError("Las contraseñas no coinciden")
        } else {
            setError("")
        }
    }
    return (
        <>
            <div className="bg-gradient-to-t from-white to-blue-500 min-h-screen flex flex-col justify-center items-center">

                {/* Logo en la parte superior izquierda */}
                <div className="absolute top-4 left-4 flex items-center">
                    <CalendarDays className="text-white h-10 w-10" />
                    <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
                </div>

                <form className="grid gap-4 border-4 w-96 p-6 bg-white shadow-md rounded-md border-blue-500">
                    <label className="grid text-4xl place-items-center text-blue-500">Crear Cuenta</label>
                    <label className="text-xl font-bold">Correo</label>
                    <input 
                        type="email" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic" 
                        placeholder="Nombre@hotmail.com"
                        required
                    />
                    {/* Campo de contraseña con botón para mostrar/ocultar */}
                <label className="text-xl font-bold">Contraseña</label>
                <div className="relative w-80">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePassword(e.target.value)}
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

                {/* Campo de confirmación de contraseña con botón para mostrar/ocultar */}
                <label className="text-xl font-bold">Confirmar Contraseña</label>
                <div className="relative w-80">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10"
                        required
                        placeholder="******"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                    {error && <span className="text-red-500">{error}</span>}
                    <button 
                        className={`mt-5 py-2 rounded-md transition-colors ${
                            error || !password || !confirmPassword
                              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-700"
                          }`}
                        disabled={!!error}
                        >
                        Crear Cuenta
                    </button>
                    <label className="grid place-items-center">O</label>
                    <div className="grid place-items-center">
                        <label>
                            Ya tienes una cuenta? <Link to={"/login"} className="text-blue-500 hover:text-blue-700"> Inicia Sesion</Link>
                        </label>
                    </div>
 
                </form>
            </div>
        </>
    )
}