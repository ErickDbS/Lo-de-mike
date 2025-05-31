import { Link } from "react-router-dom";
import EditScheduleModal from "../modals/EditSchedule/EditScheduleModal";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useDELETESchedule } from "../../hooks/useDELETESchedule";

interface Horario {
    group: group;
    career: career;
    classroom: classroom;
}

interface group {
    group_id: string;
}

interface career {
    career_id: string;
}

interface classroom {
    classroom_id: string;
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
    const deleteScheduleMutation = useDELETESchedule();

    const formattingTime = (hora: string): string => {
        const partes = hora.split(":");
        if (partes.length < 2) {
            return hora;
        }
        return `${partes[0]}:${partes[1]}`;
    };

    const handleOpen = () => {
        setIsRendered(true);
        setIsOpen(true);
    };

    const deleteSchedule = () => {
        Swal.fire({
            title: "¿Está seguro de eliminar el horario?",
            text: "Si elimina este horario toda la información realacionada a este se perderá.",
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                deleteScheduleMutation.mutate(horarios[0].group.group_id, {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Horario eliminado exitosamente",
                            theme: "dark",
                            icon: "success",
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            theme: "dark",
                            icon: "error",
                            title: "No fue posible eliminar el horario.",
                            text: "Por favor inténtalo de nuevo.",
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="justify-center items-center rounded-2xl group hover:scale-102 transition duration-300 ease-in-out ">
            <div className="w-full max-w-5xl  rounded-2xl shadow-lg overflow-hidden min-h-[25rem]">
                <div className="bg-blue-800 text-white p-4 text-center text-base font-bold flex flex-row justify-between">
                    <Link
                        className="absolute start-6 hidden group-has-hover:block hover:scale-115 hover:cursor-pointer transition duration-300 ease-in-out text-red-500 animate-fade-right animate-ease-linear animate-duration-300 "
                        to="#"
                        onClick={deleteSchedule}
                        title="Eliminar horario"
                    >
                        <Trash />
                    </Link>

                    <h1 className="w-full">
                        Grupo {grupo} {carrera} - {aula}
                    </h1>
                    <Link
                        className="absolute end-6 hidden group-has-hover:block hover:scale-115 hover:cursor-pointer transition duration-300 ease-in-out text-yellow-500 animate-fade-left animate-ease-linear animate-duration-300 "
                        to="#"
                        onClick={handleOpen}
                        title="Editar horario"
                    >
                        <Pencil />
                    </Link>
                    {isRendered && (
                        <EditScheduleModal
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            onExited={() => setIsRendered(false)}
                            career_Id={horarios[0].career.career_id}
                            group_Id={horarios[0].group.group_id}
                            classroom_id={horarios[0].classroom.classroom_id}
                        />
                    )}
                </div>

                {/* Tabla */}
                <table className="w-full text-white min-h-[25rem]">
                    <thead>
                        <tr className="bg-gray-700 h-10">
                            <th className="p-3 text-sm w-25">Hora</th>
                            <th className="p-3 text-sm">Materia</th>
                            <th className="p-3 text-sm">Profesor</th>
                            <th className="p-3 text-sm">Unidad</th>
                            <th className="p-3 text-sm">Tema</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {horarios.map((horario: any, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="odd:bg-gray-800 even:bg-gray-700 transition duration-200"
                                >
                                    <td className="p-3 text-xs text-center">
                                        {`${formattingTime(
                                            horario.start_time
                                        )} - ${formattingTime(
                                            horario.end_time
                                        )}`}
                                    </td>
                                    <td className="p-3 text-xs text-center">
                                        {horario.subject.name}
                                    </td>
                                    <td className="p-3 text-xs text-center">
                                        {`${horario.master.acronym} ${horario.master.lastname} ${horario.master.name}`}
                                    </td>
                                    <td className="p-3 text-xs text-center">
                                        {horario.unit?.title}
                                    </td>
                                    <td className="p-3 text-xs text-center">
                                        {horario.topic?.title}
                                    </td>
                                </tr>
                            ))}

                            {[...Array(7 - horarios.length)].map((_, i) => (
                                <tr
                                    key={i}
                                    className="odd:bg-gray-800 even:bg-gray-700 transition duration-200"
                                >
                                    <td className="p-3 text-xs text-center"></td>
                                    <td className="p-3 text-xs text-center"></td>
                                    <td className="p-3 text-xs text-center"></td>
                                    <td className="p-3 text-xs text-center"></td>
                                    <td className="p-3 text-xs text-center"></td>
                                </tr>
                            ))}
                        </>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
