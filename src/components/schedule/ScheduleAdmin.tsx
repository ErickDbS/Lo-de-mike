// import EditScheduleModal from "../modals/EditScheduleModal";

import { Link } from "react-router-dom";
import EditScheduleModal from "../modals/EditSchedule/EditScheduleModal";
import { useState } from "react";
import { Pencil } from "lucide-react";

interface Horario {
    hora: string;
    materia: string;
    profesor: string;
    tema: string;
}

interface ScheduleProps {
    grupo: string;
    carrera: string;
    aula: string;
    horarios: Horario[];
}

export default function ScheduleAdmin({
    grupo,
    carrera,
    aula,
    horarios,
}: ScheduleProps) {
    const [isRendered, setIsRendered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    console.log("horarios", horarios);

    const handleOpen = () => {
        setIsRendered(true);
        setIsOpen(true);
    };
    // const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

    // const toggleCheck = (key: string) => {
    //     setChecked((prev) => ({
    //         ...prev,
    //         [key]: !prev[key],
    //     }));
    // };

    // const dias = ["L", "M", "M", "J", "V"];

    return (
        <div className="flex justify-center items-center rounded-2xl group hover:scale-102 transition duration-300 ease-in-out h-[18rem] ">
            <div className="w-full max-w-5xl  rounded-2xl shadow-lg overflow-hidden">
                <Link
                    className="absolute end-6 top-4 hidden group-has-hover:block hover:scale-115 hover:cursor-pointer transition duration-300 ease-in-out text-yellow-500 animate-fade-left animate-ease-linear animate-duration-300 "
                    to="#"
                    onClick={handleOpen}
                    title="Editar horario."
                >
                    <Pencil />
                </Link>
                {isRendered && (
                    <EditScheduleModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onExited={() => setIsRendered(false)}
                    />
                )}

                <div className="bg-blue-800 text-white p-4 text-center text-base font-bold">
                    Grupo {grupo} {carrera} - {aula}
                </div>

                {/* Tabla */}
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3 text-sm">Hora</th>
                            <th className="p-3 text-sm">Materia</th>
                            <th className="p-3 text-sm">Profesor</th>
                            {/* <th className="p-3 text-blue-500">L</th>
                            <th className="p-3 text-yellow-500">M</th>
                            <th className="p-3 text-orange-500">M</th>
                            <th className="p-3 text-green-500">J</th>
                            <th className="p-3 text-red-500">V</th> */}
                            <th className="p-3 text-sm">Tema</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horarios.map((horario, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="odd:bg-gray-800 even:bg-gray-700 transition duration-200"
                            >
                                <td className="p-3 text-xs text-center">
                                    {`${horario.start_time} - ${horario.end_time}`}
                                </td>
                                <td className="p-3 text-xs text-center">
                                    {horario.unit.title}
                                </td>
                                <td className="p-3 text-xs text-center">
                                    {`${horario.master.acronym}${horario.master.lastname} ${horario.master.name}`}
                                </td>
                                {/* {dias.map((_, dayIndex) => {
                                    const key = `${rowIndex}-${dayIndex}`;
                                    return (
                                        <td
                                            key={key}
                                            className="p-3 text-center"
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                id={key}
                                                checked={checked[key] || false}
                                                onChange={() =>
                                                    toggleCheck(key)
                                                }
                                            />
                                            <label
                                                htmlFor={key}
                                                className="w-8 h-8 inline-flex items-center justify-center bg-gray-700 rounded-lg cursor-pointer border border-gray-500 hover:bg-gray-600 transition relative"
                                            >
                                                <span
                                                    className={`absolute w-5 h-5 text-green-400 transform scale-0 transition-transform duration-300 ease-out ${
                                                        checked[key]
                                                            ? "scale-100 animate-bounce-up"
                                                            : ""
                                                    }`}
                                                >
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        ></path>
                                                    </svg>
                                                </span>
                                            </label>
                                        </td>
                                    );
                                })} */}
                                <td className="p-3 text-xs text-center">
                                    {horario.subject.name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
