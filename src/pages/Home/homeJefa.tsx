import { useState, useMemo } from "react";
import ScheduleAdmin from "../../components/schedule/ScheduleAdmin";
import { LoaderCircle } from "lucide-react";
import { useGETSchedules } from "../../hooks/useGETSchedules";

export default function HomeJefa() {
    const schedules = useGETSchedules();
    const [searchTerm, setSearchTerm] = useState("");

    // Ordenar data por grupos
    const groupedData = useMemo(() => {
        if (!schedules.data) return [];
        const map: Record<string, any[]> = {};
        schedules.data.classes.forEach((row: any) => {
            const groupName = row.group?.name?.trim() || "";
            if (!map[groupName]) map[groupName] = [];
            map[groupName].push(row);
        });
        return Object.values(map);
    }, [schedules.data]);

    // Filtrar por busqueda
    const filteredData = useMemo(() => {
        if (!searchTerm) return groupedData;
        const term = searchTerm.toLowerCase();
        return groupedData.filter((groupArr) => {
            const grupo = groupArr[0].group.name.toLowerCase();
            const aula = groupArr[0].classroom.name.toLowerCase();
            return grupo.includes(term) || aula.includes(term);
        });
    }, [groupedData, searchTerm]);

    return (
        <>
            <div className="flex flex-row w-full mb-2 overflow-hidden">
                <h1 className="text-white text-xl font-bold w-1/8 justify-center content-center ml-4">
                    Lista de horarios
                </h1>
                <div className="w-7/8 min-w-[200px]">
                    <div className="relative content-center items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1e2022] placeholder:text-slate-400 text-white text-lg rounded-lg pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
                            placeholder="Buscar horario por grupo o aula..."
                        />
                        <button
                            className="absolute top-1 right-1 flex items-center rounded bg-blue-800 py-1 px-2.5 border border-transparent text-center text-lg text-white transition-all shadow-sm hover:shadow focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer"
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 mr-2"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {schedules.isLoading ? (
                <div className="flex w-full h-[calc(100svh_-_13rem)] justify-center text-center items-center bg-[#1e2022] rounded-lg">
                    <LoaderCircle className="animate-spin text-white h-15 w-15" />
                </div>
            ) : (
                <div className="w-full h-[calc(100svh_-_13rem)] bg-[#1e2022] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                    {filteredData.length > 0 ? (
                        filteredData.map((scheduleGroup, index) => (
                            <ScheduleAdmin
                                key={index}
                                grupo={scheduleGroup[0].group.name}
                                carrera={scheduleGroup[0].career.career}
                                aula={scheduleGroup[0].classroom.name}
                                horarios={scheduleGroup}
                            />
                        ))
                    ) : (
                        <p className="text-center text-white col-span-full">
                            No se encontraron horarios para “{searchTerm}”.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
