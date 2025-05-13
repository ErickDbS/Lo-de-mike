import { Check, X, List } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';

interface PersonalCardProps {
    nameProfesor: string;
    nameMateria: string;
    Tema:string;
    Hora:string;
}

export default function PersonalCard({ nameMateria, nameProfesor, Hora, Tema }: PersonalCardProps) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const [startStr, endStr] = Hora.split(" - ");

            const [startHour, startMin] = startStr.split(":").map(Number);
            const [endHour, endMin] = endStr.split(":").map(Number);

            const startTime = new Date();
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date();
            endTime.setHours(endHour, endMin, 0, 0);

            setIsActive(now >= startTime);
        };

        checkTime();

        // Revisa cada minuto
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, [Hora]);

    return (
        <div className="grid place-items-center">
            <div className="text-white text-4xl border border-solid rounded-xl w-225 grid grid-cols-2 items-center p-5 mb-4 bg-gray-900 hover:bg-gray-800 transition">
                <div className="text-xl space-y-2">
                    <p><strong className="text-blue-800">Materia:</strong> {nameMateria}</p>
                    <p><strong className="text-blue-800">Profesor:</strong> {nameProfesor}</p>
                    <p><strong className="text-blue-800">Tema:</strong> {Tema}</p>
                    <p><strong className="text-blue-800">Hora:</strong> {Hora}</p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        disabled={!isActive}
                        className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2 cursor-pointer
                            ${isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-200"}
                        `}
                    >
                        <Check size={20} /> Asistió

                    </button>
                    <button
                        type="button"
                        disabled={!isActive}
                        className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2 cursor-pointer
                            ${isActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-200"}
                        `}
                    >
                        <X size={20} /> No asistió
                    </button>
                    <button
                        type="button"
                        disabled={!isActive}
                        className={`px-4 py-2 rounded-xl text-xl transition flex items-center gap-2 cursor-pointer
                            ${isActive ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-200"}
                        `}
                    >
                     Llego tarde
                    </button>
                </div>
            </div>
        </div>
    );
}

