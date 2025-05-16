import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/authContext";
import PersonalCard from "../../components/Cards/PersonalCard/PersonalCard";
import { List } from "lucide-react";

export default function Assists() {
  const authContext = useContext(AuthContext) as any;
  const userRole: any = authContext.storage.role;
  const [open, setOpen] = useState(false);
  const [clases, setClases] = useState([]);
  const [grupoUsuario, setGrupoUsuario] = useState("");
  const fecha = new Date()
  const fechaActual = fecha.toLocaleDateString("es-MX")

  const registrarAsistencia = async (
    estado: 'A' | 'NA' | 'R',
    classId: number,
    masterId: number,
    fecha: string
  ) => {
    try {
      const response = await fetch("https://schedulechecker.up.railway.app/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado,
          classId,
          masterId,
          fecha,
        }),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);
    } catch (error) {
      console.error("Error al enviar asistencia:", error);
    }
  };



  useEffect(() => {
    const group = localStorage.getItem("group_name");
    setGrupoUsuario(group ?? "sin grupo");

    fetch("https://schedulechecker.up.railway.app/api/class")
      .then((response) => response.json())
      .then((data) => {
        const filterGroup = data.classes.filter(
          (clase: any) => clase.group.name === group
        );
        setClases(filterGroup);
      })
      .catch((error) => console.error("Error al recuperar los datos", error));
  }, []);


  if (userRole === 1) {
    return (
      <div className="p-4 w-full max-w-sm md:max-w-md md:max-w-lg lg:max-w-2xl">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-800 text-white px-4 py-2 rounded-md shadow w-full hover:bg-blue-900 transition flex justify-between items-center cursor-pointer"
        >
          <span>{fechaActual}</span>
          <span>Mostrar Materias</span>
          <List size={24} />
        </button>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="mt-5 space-y-4">
            {clases.map((clase: any) => (
              <PersonalCard
                key={clase.id}
                nameProfesor={`${clase.master.acronym} ${clase.master.name} ${clase.master.lastname}`}
                nameMateria={clase.subject.name}
                Tema={clase.topic.title}
                Hora={`${clase.start_time} - ${clase.end_time}`}
                masterId={clase.master_id}
                classId={clase.id}
                onRegistrarAsistencia={registrarAsistencia}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
