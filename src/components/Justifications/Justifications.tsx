import { useEffect, useState } from "react";

const JustificationForm = ({ masterId }: { masterId: string }) => {
    const [attendances, setAttendances] = useState<any[]>([]);
    const [justifications, setJustifications] = useState<{
        [key: string]: string;
    }>({});
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const justificationRes = await fetch(
                    `${apiUrl}/justifications/master/${masterId}`
                );
                let justificationData = { justifications: [] };
                if (justificationRes.ok) {
                    justificationData = await justificationRes.json();
                }
                const justifiedAttendanceIds = new Set(
                    (justificationData.justifications || []).map(
                        (j: any) => j.attendance_id
                    )
                );

                const urls = [
                    `${apiUrl}/attendances/master/${masterId}/NA`,
                    `${apiUrl}/attendances/master/${masterId}/R`,
                ];

                const results = await Promise.all(
                    urls.map((url) =>
                        fetch(url)
                            .then((res) => res.json())
                            .catch(() => ({ attendance: [] }))
                    )
                );

                const allAttendances = [
                    ...(results[0].attendance || []),
                    ...(results[1].attendance || []),
                ];

                // Filtrar las asistencias que ya tienen justificación enviada
                const filteredAttendances = allAttendances.filter(
                    (att) => !justifiedAttendanceIds.has(att.id)
                );

                setAttendances(filteredAttendances);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [masterId]);

    const handleJustificationChange = (id: string, text: string) => {
        setJustifications((prev) => ({ ...prev, [id]: text }));
    };

    const handleSubmit = async (attendance_id: string) => {
        const justification = justifications[attendance_id] || "";

        const payload = {
            attendance_id,
            justification,
            status: "P", // Pendiente
        };

        try {
            const response = await fetch(`${apiUrl}/justifications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Justificación enviada correctamente.");
                // Quitar la asistencia de la lista para que desaparezca la card
                setAttendances((prev) =>
                    prev.filter((att) => att.id !== attendance_id)
                );
                // Quitar la justificación guardada del textarea
                setJustifications((prev) => {
                    const copy = { ...prev };
                    delete copy[attendance_id];
                    return copy;
                });
            } else {
                alert("Error al enviar la justificación.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al enviar la justificación.");
        }
    };

    if (loading)
        return (
            <p className="text-white text-center mt-10 text-lg font-semibold">
                Cargando asistencias...
            </p>
        );

    return (
        <div className="p-6 max-w-4xl mx-auto grid gap-6">
            {attendances.length === 0 && (
                <p className="text-center text-white text-lg font-medium">
                    No hay retardos ni inasistencias por justificar.
                </p>
            )}

            {attendances.map((att, index) => (
                <div
                    key={att.id}
                    className="bg-black rounded-xl shadow-lg shadow-blue-900/50 p-6 text-white
                     transform transition-transform duration-300 hover:scale-[1.03] cursor-pointer
                     animate-fadeInSlide"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <h3 className="font-bold text-2xl mb-3 text-white drop-shadow-md">
                        Estado:{" "}
                        {att.status === "R" ? "Retardo" : "Inasistencia"}
                    </h3>

                    <p className="mb-1 text-gray-300">
                        <strong>Materia:</strong> {att.subject?.name || "N/A"}
                    </p>

                    <p className="mb-1 text-gray-300">
                        <strong>Grupo:</strong> {att.group?.name || "N/A"}
                    </p>

                    <p className="mb-1 text-gray-300">
                        <strong>Hora:</strong>{" "}
                        {att.class_schedule
                            ? `${att.class_schedule.start_time} - ${att.class_schedule.end_time}`
                            : "N/A"}
                    </p>

                    <p className="mb-2 text-gray-300">
                        <strong>Fecha:</strong> {att.date || "Sin fecha"}
                    </p>

                    <textarea
                        className="w-full border border-gray-700 rounded-md p-3 mt-2 bg-black text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400
                       resize-none transition-shadow duration-200"
                        rows={4}
                        placeholder="Escribe tu justificación..."
                        value={justifications[att.id] || ""}
                        onChange={(e) =>
                            handleJustificationChange(att.id, e.target.value)
                        }
                    />

                    <button
                        onClick={() => handleSubmit(att.id)}
                        className="mt-4 bg-blue-600 text-white font-semibold px-5 py-2 rounded-md
                       hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-xl"
                    >
                        Enviar Justificación
                    </button>
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

export default JustificationForm;
