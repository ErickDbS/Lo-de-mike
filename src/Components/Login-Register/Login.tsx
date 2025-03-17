import { Link } from "react-router-dom"

export default function Login(){
    return (
        <>
            <div className="bg-gradient-to-t from-white to-blue-500 min-h-screen flex flex-col justify-center items-center">
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
                    <input 
                        type="password" 
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400"
                        required 
                        placeholder="******"
                        />
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