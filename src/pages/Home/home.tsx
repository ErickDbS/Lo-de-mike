import { useEffect, useState } from "react";
import Card from "../../components/Cards/CardSchedule/Card";
import Schedule from "../../components/schedule/Schedule";
import { useFetch } from "../../hooks/useFetch";

export default function Home() {
    const { data } = useFetch("https://schedulechecker.up.railway.app/api/class", {
        method: "GET",
    });

    // 1. Define el tipo de clase
    type Clase = {
        hora: string;
        materia: string;
        profesor: string;
        tema: string;
        start: string;
        end: string;
    };
  

    // 2. Aplícalo al estado
    const [horarios, setHorarios] = useState<Clase[]>([]);
    const [claseActual, setClaseActual] = useState<Clase | null>(null);


    useEffect(() => {
        if (!data || !data.classes) return;

        const nuevosHorarios = data.classes.map((clase: any) => ({
            hora: `${clase.start_time.slice(0, 5)} - ${clase.end_time.slice(0, 5)}`,
            materia: clase.subject.name,
            profesor: `${clase.master.acronym} ${clase.master.name} ${clase.master.lastname}`,
            tema: clase.topic.title,
            start: clase.start_time.slice(0, 5),
            end: clase.end_time.slice(0, 5),
        }));

        setHorarios(nuevosHorarios);

        const verificarClaseActual = () => {
            const ahora = new Date();
            const horaActual = ahora.getHours().toString().padStart(2, "0");
            const minutosActuales = ahora.getMinutes().toString().padStart(2, "0");
            const tiempoActual = `${horaActual}:${minutosActuales}`;

            const claseEnCurso = nuevosHorarios.find((h:any) => {
                return tiempoActual >= h.start && tiempoActual < h.end;
            });

            setClaseActual(claseEnCurso || null);
        };

        verificarClaseActual();

        const intervalo = setInterval(verificarClaseActual, 60000); // actualiza cada minuto
        return () => clearInterval(intervalo); // limpia al desmontar
    }, [data]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl flex items-center justify-center rounded text-white">
                <Schedule grupo="4-03-IS" aula="Aula 20" horarios={horarios} />
            </div>

            <div className="mt-10 bg-[#1e2022] flex flex-col items-center justify-center rounded text-white">


                <Card
                    nameProfesor={claseActual?.profesor ?? "Sin profesor"}
                    nameMateria={claseActual?.materia ?? "No hay materia actualmente"}
                    Tema={claseActual?.tema ?? "-"}
                    Hora={claseActual?.hora ?? "-"}
                    mostrarBoton={!!claseActual} // ⬅️ Mostrar botón solo si hay clase
                />
            </div>
        </div>
    );
}
