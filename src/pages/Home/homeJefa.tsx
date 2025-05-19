import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchComponent/SearchBar";
import ScheduleAdmin from "../../components/schedule/ScheduleAdmin";
import { LoaderCircle } from "lucide-react";
import { forEach } from "rsuite/esm/internals/utils/ReactChildren";

interface data {
    classes: any;
    status: any;
}

export default function HomeJefa() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://schedulechecker.up.railway.app/api/classes") // tu endpoint real
            .then((res) => res.json())
            .then((data: data[]) => {
                //crear un arreglo mamalon
                const dataOrder = data.classes.reduce((acc, row) => {
                    const groupName = row.group?.name?.trim();
                    if (!groupName) {
                        console.warn("Clase sin nombre de grupo válido:", row);
                        return acc;
                    }
                    if (!acc[groupName]) {
                        acc[groupName] = [];
                    }
                    acc[groupName].push(row);
                    return acc;
                }, {});

                const arrayByGroup = Object.values(dataOrder);

                setSchedules(arrayByGroup);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    console.log("clasess", schedules);

    const horarios = [
        {
            hora: "17:00 - 18:00",
            materia: "la de Edgar",
            profesor: "El Edgar",
            tema: "el que da Edgar",
        },
        {
            hora: "18:00 - 19:00",
            materia: "la de Mike",
            profesor: "El Mike",
            tema: "el que da Mike",
        },
        {
            hora: "19:00 - 20:00",
            materia: "la de Herman",
            profesor: "El Herman",
            tema: "el que da Herman",
        },
        {
            hora: "20:00 - 21:00",
            materia: "la de Mirsa",
            profesor: "El Mirsa",
            tema: "el que da Mirsa",
        },
        {
            hora: "21:00 - 22:00",
            materia: "la de Rocio",
            profesor: "La Rocio",
            tema: "la que da Rocio",
        },
    ];

    return (
        // La jef@ de carrera podra ver las justificaciones de los
        //         profesores de sus retardos o faltas y crear horarios. Crear
        //         horarios
        <>
            <div className="flex flex-row w-full mb-2 overflow-hidden">
                <h1 className="text-white text-xl font-bold w-1/8 justify-center content-center ml-4">
                    Lista de horarios
                </h1>
                <SearchBar />
            </div>
            {loading ? (
                <div className="flex w-full h-[calc(100svh_-_13rem)] justify-center text-center items-center bg-[#1e2022] rounded-lg">
                    <LoaderCircle className="animate-spin text-white h-15 w-15" />
                </div>
            ) : (
                <div className="w-full h-[calc(100svh_-_13rem)] bg-[#1e2022] rounded-lg p-2 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                    {schedules.map((schedule, index) => {
                        return (
                            <ScheduleAdmin
                                key={index}
                                grupo={schedule[0].group.name}
                                carrera="Carrera"
                                aula={schedule[0].classroom.name}
                                horarios={schedule}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}
