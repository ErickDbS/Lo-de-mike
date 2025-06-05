import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { AuthContext } from '../../utils/authContext';

const API_BASE = import.meta.env.VITE_API_URL;

/* ──────────── Tipos ──────────── */
type Master = {
    master_id: number;
    acronym: string;
    name: string;
    lastname: string;
};

type Attendance = {
    id: number;
    master_id: number;
};

type Justification = {
    id: number;
    attendance_id: number;
    justification: string;
    created_at: string;
    status: string; // P, A, R
};

/* ──────────── Componente ──────────── */
export default function JustificationsPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [justifications, setJustifications] = useState<Justification[]>([]);
  const [filteredJustifications, setFilteredJustifications] = useState<Justification[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string>('');
      const authContext = useContext(AuthContext) as any;
      const userRole: any = authContext.storage.role;

    useEffect(() => {
        (async () => {
            try {
                const [mRes, aRes, jRes] = await Promise.all([
                    fetch(`${API_BASE}/masters`).then((r) => r.json()),
                    fetch(`${API_BASE}/attendances`).then((r) => r.json()),
                    fetch(`${API_BASE}/justifications`).then((r) => r.json()),
                ]);

                setMasters(mRes.masters || []);
                setAttendances(aRes.attendance || []);
                setJustifications(jRes.justifications || []);
            } catch (err) {
                console.error("Error al cargar los datos:", err);
                Swal.fire("Error", "No se pudieron cargar los datos.", "error");
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedMaster) {
            setFilteredJustifications([]);
            return;
        }

        const attendanceIds = attendances
            .filter((a) => a.master_id === Number(selectedMaster))
            .map((a) => a.id);

        setFilteredJustifications(
            justifications.filter(
                (j) =>
                    attendanceIds.includes(j.attendance_id) && j.status === "P"
            )
        );
    }, [selectedMaster, attendances, justifications]);

    const handleReview = async (justId: number, status: "A" | "R") => {
        const verb = status === "A" ? "aceptar" : "rechazar";

        const confirm = await Swal.fire({
            title: `¿Estás segur@ de ${verb} esta justificación?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: status === "A" ? "#3085d6" : "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: `Sí, ${verb}`,
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        const reviewerId =
            localStorage.getItem("enrollment_number") || "sin id";

        const payload: {
            reviewed_by: string;
            status: string;
            review_comment?: string;
        } = {
            reviewed_by: reviewerId,
            status,
        };

        if (status === "A") payload.review_comment = "Justificación aceptada";
        if (status === "R") payload.review_comment = "Justificación rechazada";

        try {
            const res = await fetch(
                `${API_BASE}/justifications/review/${justId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `Error ${res.status}`);
            }

            setJustifications((prev) =>
                prev.map((j) => (j.id === justId ? { ...j, status } : j))
            );
            setFilteredJustifications((prev) =>
                prev.filter((j) => j.id !== justId)
            );

            Swal.fire(
                "Éxito",
                `Justificación ${verb} correctamente.`,
                "success"
            );
        } catch (err) {
            console.error("Error al actualizar la justificación:", err);
            Swal.fire("Error", `No se pudo ${verb} la justificación.`, "error");
        }
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleString("es-MX", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    if (userRole === 4) {
      return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Revisión&nbsp;de&nbsp;Justificaciones
          </h1>

          <div className="mb-6">
            <label
              htmlFor="masterSelect"
              className="block text-sm font-medium text-white mb-1"
            >
              Selecciona un profesor
            </label>
            <select
              id="masterSelect"
              className="w-full border border-blue-200 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-gray-900 text-white"
              value={selectedMaster}
              onChange={e => setSelectedMaster(e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {masters.map(m => (
                <option key={m.master_id} value={m.master_id}>
                  {m.acronym} {m.name} {m.lastname}
                </option>
              ))}
            </select>
          </div>

          {filteredJustifications.length === 0 ? (
            <p className="text-white italic">
              No hay justificaciones pendientes para este profesor.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredJustifications.map(j => (
                <div
                  key={j.id}
                  className="border border-blue-200 rounded-lg p-4 shadow-sm bg-gray-800 text-white transition transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                >
                  <p className="mb-2">
                    <strong>Justificación:</strong> {j.justification}
                  </p>
                  <p className="mb-4 text-sm">
                    <strong>Fecha:</strong> {formatDate(j.created_at)}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(j.id, 'A')}
                      className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-4 py-2 rounded transition duration-200"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleReview(j.id, 'R')}
                      className="border border-blue-800 text-white hover:bg-blue-900 hover:border-white font-medium px-4 py-2 rounded transition duration-200"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }
  
}
