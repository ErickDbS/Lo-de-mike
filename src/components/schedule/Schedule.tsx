import { useState } from "react";

interface Horario {
    hora: string;
    materia: string;
    profesor: string;
    tema: string;
}

interface Tarea {
    userid: string;
    user: string,
    password: string,
    active: string
}

interface ScheduleProps {
    grupo: string;
    aula: string;
    horarios: Horario[];
    tareas: Tarea[]; // Cambia el tipo según la estructura de tus tareas
}

export default function Schedule({ grupo, aula, horarios, tareas }: ScheduleProps) {
    const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

    console.log("Tareas:", tareas);

    const toggleCheck = (key: string) => {
        setChecked((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const dias = ["L", "M", "M", "J", "V"];


    return (
        <div className="bg-gray-900 min-h-screen flex justify-center items-center p-6">
            <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Encabezado */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center text-xl font-bold">
                    Grupo {grupo} - {aula}
                </div>

                {/* Tabla */}
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3">Hora</th>
                            <th className="p-3">Materia</th>
                            <th className="p-3">Profesor</th>
                            <th className="p-3 text-blue-500">L</th>
                            <th className="p-3 text-yellow-500">M</th>
                            <th className="p-3 text-orange-500">M</th>
                            <th className="p-3 text-green-500">J</th>
                            <th className="p-3 text-red-500">V</th>
                            <th className="p-3">Tema</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horarios.map((horario, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="odd:bg-gray-800 even:bg-gray-700 hover:bg-gray-600 transition duration-200"
                            >
                                <td className="p-3 text-center">{horario.hora}</td>
                                <td className="p-3 text-center">{horario.materia}</td>
                                <td className="p-3 text-center">{horario.profesor}</td>
                                {dias.map((_, dayIndex) => {
                                    const key = `${rowIndex}-${dayIndex}`;
                                    return (
                                        <td key={key} className="p-3 text-center">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                id={key}
                                                checked={checked[key] || false}
                                                onChange={() => toggleCheck(key)}
                                            />
                                            <label
                                                htmlFor={key}
                                                className="w-8 h-8 inline-flex items-center justify-center bg-gray-700 rounded-lg cursor-pointer border border-gray-500 hover:bg-gray-600 transition relative"
                                            >
                                                <span
                                                    className={`absolute w-5 h-5 text-green-400 transform scale-0 transition-transform duration-300 ease-out ${
                                                        checked[key] ? "scale-100 animate-bounce-up" : ""
                                                    }`}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                    );
                                })}
                                <td className="p-3 text-center">{horario.tema}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
