import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../utils/authContext";
import PersonalCard from "../../components/Cards/PersonalCard/PersonalCard";
import { List } from "lucide-react";

export default function Assists() {
  const authContext = useContext(AuthContext) as any;
  const userRole: any = authContext.storage.role;
  const [open, setOpen] = useState(false);
  const [clases, setClases] = useState<any[]>([]);
  const [grupoUsuario, setGrupoUsuario] = useState("");
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState<
    { class_schedule_id: number; date: string; status: "A" | "NA" | "R" }[]
  >([]);
  const fecha = new Date();
  const fechaActual = fecha.toLocaleDateString("es-MX");
  const apiUrl = import.meta.env.VITE_API_URL;

  const obtenerAsistencias = async () => {
    try {
      const res = await fetch(`${apiUrl}/attendances`);
      const data = await res.json();

      const asistencias = (data.attendance || []).map((a: any) => ({
        class_schedule_id: a.class_schedule_id,
        date: a.created_at.slice(0, 10),
        status: a.status, // <-- Incluye el estado
      }));

      setAsistenciasRegistradas(asistencias);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
    }
  };

  const registrarAsistencia = async (
    status: "A" | "NA" | "R",
    class_schedule_id: number,
    master_id: number
  ) => {
    try {
      const response = await fetch(`${apiUrl}/attendances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_schedule_id,
          master_id,
          status,
        }),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      // Después de registrar la asistencia, recarga las asistencias para actualizar la UI
      obtenerAsistencias();
    } catch (error) {
      console.error("Error al enviar asistencia:", error);
    }
  };

  useEffect(() => {
    const group = localStorage.getItem("group_name");
    setGrupoUsuario(group ?? "sin grupo");

    fetch(`${apiUrl}/class`)
      .then((response) => response.json())
      .then((data) => {
        const clasesRaw = data.classes;
        console.log("datos en crudo", clasesRaw);

        if (clasesRaw && Array.isArray(clasesRaw)) {
          const filterGroup = clasesRaw.filter(
            (clase: any) => clase.group?.name === group
          );
          setClases(filterGroup);
          console.log("Clases filtradas por grupo:", filterGroup);
        } else {
          console.warn("No se encontraron clases en la respuesta.");
        }
      })
      .catch((error) => console.error("Error al recuperar los datos", error));

    // Obtener asistencias al montar el componente
    obtenerAsistencias();
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);

  if (userRole === 1) {
    return (
      <div className="p-4 w-full max-w-sm md:max-w-md lg:max-w-2xl">
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
            {clases.map((clase: any) => {
              const asistencia = asistenciasRegistradas.find(
                (a) => a.class_schedule_id === clase.id && a.date === hoy
              );
              const yaRegistrada = !!asistencia;

              return (
                <PersonalCard
                  key={clase.id}
                  nameProfesor={
                    clase.master
                      ? `${clase.master.acronym ?? ""} ${clase.master.name ?? ""} ${clase.master.lastname ?? ""}`
                      : "Profesor no asignado"
                  }
                  nameMateria={clase.subject?.name ?? "Materia no asignada"}
                  Tema={clase.topic?.title ?? "Sin tema"}
                  Hora={`${clase.start_time} - ${clase.end_time}`}
                  masterId={clase.master?.master_id ?? 0}
                  classId={clase.id}
                  onRegistrarAsistencia={registrarAsistencia}
                  asistenciaYaRegistrada={yaRegistrada}
                  estadoAsistencia={asistencia?.status} // <-- Pasa el estado
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
