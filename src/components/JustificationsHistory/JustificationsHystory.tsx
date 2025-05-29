import React, { useEffect, useState } from "react";

const JustificationHistory = ({ masterId }: { masterId: string }) => {
  const [justifications, setJustifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJustifications = async () => {
      try {
        const res = await fetch(`${apiUrl}/justifications/master/${masterId}`);
        const data = await res.json();
        setJustifications(data.justifications || []);
      } catch (error) {
        console.error("Error fetching justifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJustifications();
  }, [masterId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "P":
        return "Pendiente";
      case "A":
        return "Aprobada";
      case "R":
        return "Rechazada";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "P":
        return "text-yellow-400";
      case "A":
        return "text-green-400";
      case "R":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <p className="text-white text-center mt-10 text-lg font-semibold">
        Cargando historial de justificaciones...
      </p>
    );
  }

  if (justifications.length === 0) {
    return (
      <p className="text-white text-center mt-10 text-lg font-semibold">
        No has enviado ninguna justificación aún.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid gap-6">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Historial de Justificaciones</h2>

      {justifications.map((j, index) => (
        <div
          key={j.id}
          className="bg-black text-white p-5 rounded-xl shadow-md shadow-blue-900/40
                     animate-fadeInSlide transition-transform transform hover:scale-[1.02]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <p className="mb-2">
            <span className="font-semibold">Justificación:</span> {j.justification}
          </p>

          <p className={`mb-2 font-semibold ${getStatusColor(j.status)}`}>
            Estado: {getStatusLabel(j.status)}
          </p>

          {j.reviewed_by && (
            <div className="mb-2">
              <p>
                <span className="font-semibold">Revisado por:</span> {j.reviewed_by}
              </p>
              <p>
                <span className="font-semibold">Comentario:</span> {j.review_comment}
              </p>
              <p>
                <span className="font-semibold">Fecha de revisión:</span> {new Date(j.reviewed_at).toLocaleString()}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-1">ID de asistencia: {j.attendance_id}</p>
        </div>
      ))}

      <style>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInSlide {
          animation-name: fadeInSlide;
          animation-fill-mode: both;
          animation-timing-function: ease-out;
          animation-duration: 400ms;
        }
      `}</style>
    </div>
  );
};

export default JustificationHistory;
