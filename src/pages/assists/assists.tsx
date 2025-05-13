import { useContext, useState } from "react";
import { AuthContext } from "../../utils/authContext";
import PersonalCard from "../../components/Cards/PersonalCard/PersonalCard";
import { List } from "lucide-react";

export default function Assists() {
  const authContext = useContext(AuthContext) as any;
  const userRole: any = authContext.storage.role;
  const [open, setOpen] = useState(false);

  if (userRole === 1) {
    return (
      <div className="p-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-800 text-white px-4 py-2 rounded-md shadow w-full hover:bg-blue-900 transition flex justify-between items-center cursor-pointer"
        >
          <span>12/05/2025</span>  
          <span>Mostrar Materias</span>
          <List size={24} />
        </button>

        {/* Animación de opacidad y escala */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="mt-5">
            <PersonalCard
              nameProfesor="Juan Perez"
              nameMateria="Matematicas"
              Tema="Algebra"
              Hora="10:00 - 11:00"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
