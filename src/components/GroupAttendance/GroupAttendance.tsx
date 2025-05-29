import { useEffect, useState } from "react";
import PersonalCard from "../Cards/PersonalCard/PersonalCard";

type Clase = {
  id: number;
  materia: string;
  profesor: string;
  grupo: string;
  hora: string;
  tema: string;
  masterId: number;
};

type Group = {
  id: number;
  name: string;
};

type Asistencia = {
  class_schedule_id: number;
  date: string; // YYYY-MM-DD
};

export default function GroupAttendance() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [grupos, setGrupos] = useState<Group[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState<Asistencia[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);

  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  useEffect(() => {
    // Cargar grupos
    fetch(`${apiUrl}/groups`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.groups)) {
          setGrupos(data.groups);
        } else {
          console.error("La respuesta no contiene 'groups' como array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar grupos:", error);
      });

    // Cargar asistencias registradas
    obtenerAsistencias();
  }, []);

  const obtenerClases = async (grupo: string) => {
    setGrupoSeleccionado(grupo);
    try {
      const res = await fetch(`${apiUrl}/class`);
      const data = await res.json();

      const clasesRaw = data.clases || data.classes || [];

      const clasesGrupo = clasesRaw
        .filter((c: any) => c.group?.name === grupo)
        .map((clase: any) => ({
          id: clase.id,
          materia: clase.subject.name,
          profesor: `${clase.master.acronym} ${clase.master.name} ${clase.master.lastname}`,
          grupo: clase.group.name,
          tema: clase.topic.title,
          hora: `${clase.start_time.slice(0, 5)} - ${clase.end_time.slice(0, 5)}`,
          masterId: clase.master.master_id,
        }));

      setClases(clasesGrupo);
    } catch (error) {
      console.error("Error al obtener clases:", error);
    }
  };

  const obtenerAsistencias = async () => {
    try {
      const res = await fetch(`${apiUrl}/attendances`);
      const data = await res.json();

      const asistencias = (data.attendance || []).map((a: any) => ({
        class_schedule_id: a.class_schedule_id,
        date: a.created_at.slice(0, 10),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_schedule_id,
          master_id,
          status,
        }),
      });

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      // Actualiza asistencias tras registrar una nueva
      obtenerAsistencias();
    } catch (error) {
      console.error("Error al enviar asistencia:", error);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Asistencia por grupo
        </h2>

        <div className="mb-8">
          <label htmlFor="grupo" className="block mb-2 text-lg font-medium text-gray-200">
            Selecciona un grupo
          </label>
          <select
            id="grupo"
            onChange={(e) => obtenerClases(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un grupo
            </option>
            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.name}>
                {grupo.name}
              </option>
            ))}
          </select>
        </div>

        {grupoSeleccionado && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">
              Clases del grupo {grupoSeleccionado}
            </h3>

            <div className="grid gap-6">
              {clases.map((clase) => {
                // Verifica si ya se registró asistencia hoy para esta clase
                const asistenciaHoy = asistenciasRegistradas.some(
                  (a) => a.class_schedule_id === clase.id && a.date === hoy
                );

                return (
                  <PersonalCard
                    key={clase.id}
                    classId={clase.id}
                    nameMateria={clase.materia}
                    nameProfesor={clase.profesor}
                    Hora={clase.hora}
                    Tema={clase.tema}
                    masterId={clase.masterId}
                    onRegistrarAsistencia={registrarAsistencia}
                    asistenciaYaRegistrada={asistenciaHoy}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
