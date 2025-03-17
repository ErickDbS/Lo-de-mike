import { Link } from "react-router-dom"

export default function Register(){
    return (
        <>
            <div className="bg-gradient-to-t from-white to-blue-500 min-h-screen flex flex-col justify-center items-center">
                <form className="grid gap-4 border-4 w-96 p-6 bg-white shadow-md rounded-md border-blue-500">
                    <label className="grid text-4xl place-items-center text-blue-500">Crear Cuenta</label>
                    <label className="text-xl font-bold">Correo</label>
                    <input 
                        type="email" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic" 
                        placeholder="Nombre@hotmail.com"
                        required
                    />
                    <label className="text-xl font-bold">Contraseña</label>
                    <input 
                        type="password" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400"
                        required 
                        placeholder="******"
                    />
                    <label className="text-xl font-bold">Confirmar Contraseña</label>
                    <input 
                        type="password" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400"
                        required 
                        placeholder="******"
                    />
                    <button 
                        className="text-white rounded-md bg-blue-500 mt-5 py-2 hover:bg-blue-700"
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