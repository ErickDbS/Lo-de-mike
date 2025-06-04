import { Check, X, Ban } from "lucide-react";
import { useEffect, useState } from "react";

interface PersonalCardProps {
  nameProfesor: string;
  nameMateria: string;
  Tema: string;
  Hora: string;
  masterId: number;
  classId: number;
  onRegistrarAsistencia: (
    estado: "A" | "NA" | "R",
    classId: number,
    masterId: number
  ) => void;
  asistenciaYaRegistrada: boolean;
  estadoAsistencia?: "A" | "NA" | "R"; // <-- Nuevo prop
}

export default function PersonalCard({
  nameMateria,
  nameProfesor,
  Hora,
  Tema,
  masterId,
  classId,
  onRegistrarAsistencia,
  asistenciaYaRegistrada,
  estadoAsistencia, // <-- Nuevo prop
}: PersonalCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<"A" | "NA" | "R" | null>(null);

  // Fecha actual en formato YYYY-MM-DD
  const hoy = new Date().toISOString().slice(0, 10);
  const localKey = `asistencia_${classId}_${hoy}`;

  // Cargar estado guardado en localStorage al iniciar
  useEffect(() => {
    if (asistenciaYaRegistrada && estadoAsistencia) {
      setEstadoSeleccionado(estadoAsistencia);
    } else {
      const estado = localStorage.getItem(localKey) as "A" | "NA" | "R" | null;
      if (estado) {
        setEstadoSeleccionado(estado);
      }
    }
  }, [localKey, asistenciaYaRegistrada, estadoAsistencia]);

  // Controla si el botón está activo basado en la hora actual y hora de la clase
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const [startStr] = Hora.split(" - ");
      const [startHour, startMin] = startStr.split(":").map(Number);

      const startTime = new Date();
      startTime.setHours(startHour, startMin, 0, 0);

      setIsActive(now >= startTime);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [Hora]);

  // Cuando se selecciona un estado, lo guarda localmente y envía la asistencia
  const handleClick = (estado: "A" | "NA" | "R") => {
    setEstadoSeleccionado(estado);
    localStorage.setItem(localKey, estado);
    onRegistrarAsistencia(estado, classId, masterId);
  };

  const getEstadoTexto = (estado: "A" | "NA" | "R" | null) => {
    switch (estado) {
      case "A":
        return "Asistió";
      case "NA":
        return "No asistió";
      case "R":
        return "Llegó tarde";
      default:
        return "";
    }
  };

  const getEstadoColor = (estado: "A" | "NA" | "R" | null) => {
    switch (estado) {
      case "A":
        return "text-green-500";
      case "NA":
        return "text-red-500";
      case "R":
        return "text-yellow-400";
      default:
        return "";
    }
  };

  // Si hay asistencia registrada desde backend, usa ese estado
  const estadoFinal = asistenciaYaRegistrada && estadoAsistencia ? estadoAsistencia : estadoSeleccionado;
  const yaRegistrada = asistenciaYaRegistrada || estadoSeleccionado !== null;

  return (
    <div className="grid place-items-center">
      <div className="text-white text-4xl border border-solid rounded-xl w-250 grid grid-cols-2 items-center p-5 mb-4 bg-gray-900 hover:bg-gray-800 transition">
        <div className="text-xl space-y-2">
          <p>
            <strong className="text-blue-800">Materia:</strong> {nameMateria}
          </p>
          <p>
            <strong className="text-blue-800">Profesor:</strong> {nameProfesor}
          </p>
          <p>
            <strong className="text-blue-800">Tema:</strong> {Tema}
          </p>
          <p>
            <strong className="text-blue-800">Hora:</strong> {Hora}
          </p>
          {yaRegistrada && (
            <p className={`mt-2 text-lg font-semibold ${getEstadoColor(estadoFinal)}`}>
              Asistencia registrada: {getEstadoTexto(estadoFinal)}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            type="button"
            disabled={!isActive || yaRegistrada}
            className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2
              ${
                estadoFinal === "A"
                  ? "bg-green-700 text-white"
                  : !isActive || yaRegistrada
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-green-700 text-white"
              }`}
            onClick={() => handleClick("A")}
          >
            <Check size={20} /> Asistió
          </button>

          <button
            type="button"
            disabled={!isActive || yaRegistrada}
            className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2
              ${
                estadoFinal === "NA"
                  ? "bg-red-700 text-white"
                  : !isActive || yaRegistrada
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-red-700 text-white"
              }`}
            onClick={() => handleClick("NA")}
          >
            <X size={20} /> No asistió
          </button>

          <button
            type="button"
            disabled={!isActive || yaRegistrada}
            className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2
              ${
                estadoFinal === "R"
                  ? "bg-yellow-600 text-white"
                  : !isActive || yaRegistrada
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-yellow-600 text-white"
              }`}
            onClick={() => handleClick("R")}
          >
            <Ban size={20} /> Llegó tarde
          </button>
        </div>
      </div>
    </div>
  );
}
