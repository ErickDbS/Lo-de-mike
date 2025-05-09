import SearchBar from "../../components/SearchComponent/SearchBar";
import ScheduleAdmin from "../../components/schedule/ScheduleAdmin";

export default function HomeAdmin() {
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
            <div className="flex flex-row w-full mb-2">
                <h1 className="text-white text-xl font-bold w-1/8 justify-center content-center ml-4">
                    Lista de horarios
                </h1>
                <SearchBar />
            </div>
            <div className="w-full h-dvh bg-[#1e2022] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>

                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>

                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>
                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>
                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>
                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>
                <ScheduleAdmin
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></ScheduleAdmin>
            </div>
        </>
    );
}
