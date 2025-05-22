import { useEffect, useState } from "react";
import CheckCard from "../../components/Cards/CheckCard/CheckCard";

interface Grupo {
  group_id: number;
  name: string;
}

interface Clase {
  id: number;
  start_time: string;
  end_time: string;
  subject: {
    name: string;
  };
  master: {
    name: string;
    lastname: string;
  };
  topic: {
    title: string;
  };
  group: {
    group_id: number;
  };
}

interface Asistencia {
  id: number;
  class_schedule_id: number;
  status: string; // "A" o "NA"
  created_at: string;
}

export default function Schedule() {
    const apiUrl = import.meta.env.VITE_API_URL
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null);

  const [clases, setClases] = useState<Clase[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [loadingDatos, setLoadingDatos] = useState(false);

  useEffect(() => {
    async function fetchGrupos() {
      try {
        const res = await fetch(`${apiUrl}/groups`);
        const data = await res.json();
        setGrupos(data.groups);
        setLoadingGrupos(false);
      } catch (error) {
        console.error("Error al cargar grupos:", error);
        setLoadingGrupos(false);
      }
    }
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (grupoSeleccionado === null) {
      setClases([]);
      setAsistencias([]);
      return;
    }

    async function fetchDatos() {
      setLoadingDatos(true);
      try {
        const resClases = await fetch(`${apiUrl}/class`);
        const dataClases = await resClases.json();

        const clasesFiltradas = dataClases.classes.filter(
          (clase: Clase) => clase.group.group_id === grupoSeleccionado
        );

        const resAsistencias = await fetch(`${apiUrl}/attendances`);
        const dataAsistencias = await resAsistencias.json();

        setClases(clasesFiltradas);
        setAsistencias(dataAsistencias.attendance);
      } catch (error) {
        console.error("Error al cargar clases o asistencias:", error);
      } finally {
        setLoadingDatos(false);
      }
    }
    fetchDatos();
  }, [grupoSeleccionado]);

  // Agrupar clases por fecha según la asistencia
  const clasesAgrupadasPorFecha: Record<string, any[]> = {};

  asistencias.forEach((asistencia) => {
    const clase = clases.find((c) => c.id === asistencia.class_schedule_id);
    if (!clase) return;

    const fechaObj = new Date(asistencia.created_at);
    const fecha = fechaObj.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!clasesAgrupadasPorFecha[fecha]) {
      clasesAgrupadasPorFecha[fecha] = [];
    }

    clasesAgrupadasPorFecha[fecha].push({
      id: clase.id,
      nameMateria: clase.subject.name,
      nameProfesor: `${clase.master.name} ${clase.master.lastname}`,
      Hora: `${clase.start_time} - ${clase.end_time}`,
      Tema: clase.topic.title,
      status: asistencia.status,
    });
  });

  const fechasOrdenadas = Object.keys(clasesAgrupadasPorFecha).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <main className="min-h-screen p-8 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 border-b-4 border-blue-500 pb-2 w-full max-w-4xl text-center">
        Historial de Asistencias
      </h1>

      {/* Selector de grupo */}
      <section className="w-full max-w-4xl mb-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <label htmlFor="selectGrupo" className="text-lg font-semibold text-blue-400">
          Selecciona un grupo:
        </label>
        {loadingGrupos ? (
          <div className="text-blue-300 font-medium">Cargando grupos...</div>
        ) : (
          <select
            id="selectGrupo"
            value={grupoSeleccionado ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setGrupoSeleccionado(val ? Number(val) : null);
            }}
            className="text-gray-900 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-64 text-white"
          >
            <option value="">-- Selecciona un grupo --</option>
            {grupos.map((grupo) => (
              <option key={grupo.group_id} value={grupo.group_id}>
                {grupo.name}
              </option>
            ))}
          </select>
        )}
      </section>

      {/* Mensajes de estado */}
      <section className="w-full max-w-4xl min-h-[200px] flex flex-col items-center justify-center text-center">
        {loadingDatos && (
          <p className="text-blue-300 font-semibold animate-pulse">
            Cargando clases y asistencias...
          </p>
        )}

        {!loadingDatos && grupoSeleccionado === null && (
          <p className="text-gray-400 text-lg">
            Por favor, selecciona un grupo para ver el historial.
          </p>
        )}

        {!loadingDatos &&
          grupoSeleccionado !== null &&
          fechasOrdenadas.length === 0 && (
            <p className="text-gray-400 text-lg">
              No hay asistencias registradas para este grupo.
            </p>
          )}
      </section>

      {/* Lista agrupada por fecha */}
      <section className="w-full max-w-4xl flex flex-col gap-8">
        {fechasOrdenadas.map((fecha) => (
          <div key={fecha}>
            <h2 className="text-2xl font-bold mb-4 border-b border-blue-500 pb-1 capitalize">
              {fecha}
            </h2>
            <div className="grid gap-6">
              {clasesAgrupadasPorFecha[fecha].map((clase) => (
                <CheckCard
                  key={`${fecha}-${clase.id}`}
                  nameMateria={clase.nameMateria}
                  nameProfesor={clase.nameProfesor}
                  Hora={clase.Hora}
                  Tema={clase.Tema}
                  status={clase.status}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
