import Card from "../../components/Cards/CardSchedule/Card";
import Schedule from "../../components/schedule/Schedule";

export default function Home() {
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
        <div className="flex flex-col items-center justify-center">
            {/* Se mostrara el horario ya sea del maestro o alumno, con la fila resaltada de la hora actual de clases */}
            <div className="w-full max-w-5xl flex items-center justify-center rounded text-white">
                <Schedule
                    grupo="4-03-IS"
                    aula="Aula 20"
                    horarios={horarios}
                ></Schedule>
            </div>

            {/* Se mostrara la hora actual, junto con la materia y profesor que toque y habra un campo para marcar su falta, o asistencia, cabe recalcar que la falta solo se marcara si pasan los minutos de tolerancia */}
            <div className="mt-10 bg-[#1e2022] flex flex-col items-center justify-center rounded text-white">
                <Card
                    nameProfesor="Edgar Perez"
                    nameMateria="Redes Neuronales"
                    Hora="17:00 - 18:00"
                ></Card>
            </div>
        </div>
    );
}
