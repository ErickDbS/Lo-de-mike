import { Link } from "react-router-dom";

export default function Inicio() {

  return (
    <div className="bg-linear-to-t from-white to-blue-500 min-h-screen flex flex-col items-center">
      <header className="bg-blue-600 text-white w-full p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to={"/"} className="text-2xl font-bold">Horarios</Link>
          <aside>
            <Link 
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-blue-100 transition" to={"/register"}>Registrarse</Link>
            <Link 
            className="ml-4 bg-blue-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-800 transition" to={"/login"}>Iniciar Sesión</Link>
          </aside>
        </div>
      </header>
    </div>
  );
}