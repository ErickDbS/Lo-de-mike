import { useContext, useEffect, useState } from "react";
import Card from "../../components/Cards/CardSchedule/Card";
import Schedule from "../../components/schedule/Schedule";
import { useFetch } from "../../hooks/useFetch";
import { AuthContext } from "../../utils/authContext";
import GroupAttendance from "../../components/GroupAttendance/GroupAttendance";
import JustificationForm from "../../components/Justifications/Justifications";

export default function Home() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext.storage.role;
    const [name, setName] = useState("");

    const { data } = useFetch(`${apiUrl}/class`, {
        method: "GET",
    });

    // 1. Define el tipo de clase
    type Clase = {
        hora: string;
        materia: string;
        profesor: string;
        tema: string;
        aula: string;
        start: string;
        end: string;
    };

    // 2. Aplícalo al estado
    const [horarios, setHorarios] = useState<Clase[]>([]);
    const [claseActual, setClaseActual] = useState<Clase | null>(null);

    const group = localStorage.getItem("group_name");

    useEffect(() => {
        const userJson = localStorage.getItem("UserData");
        if (userJson) {
            const userData = JSON.parse(userJson);
            setName(userData.name);
        }

        if (!data || !data.classes) return;

        // Obtener grupo desde localStorage
        const grupoActual = localStorage.getItem("group_name");
        if (!grupoActual) return;

        // Buscar una clase que pertenezca a ese grupo
        const claseDeGrupo = data.classes.find(
            (clase: any) => clase.group?.name === grupoActual
        );

        // Si se encontró, guarda el aula en localStorage
        if (claseDeGrupo?.classroom?.name) {
            localStorage.setItem("aula_del_grupo", claseDeGrupo.classroom.name);
        }

        // Continuar con la lógica actual
        const clasesDelGrupo = data.classes.filter(
            (clase: any) => clase.group?.name === grupoActual
        );

        const nuevosHorarios = clasesDelGrupo.map((clase: any) => ({
            hora: `${clase.start_time?.slice(0, 5) ?? ""} - ${
                clase.end_time?.slice(0, 5) ?? ""
            }`,
            materia: clase.subject?.name ?? "Sin materia",
            profesor: `${clase.master?.acronym ?? ""} ${
                clase.master?.name ?? ""
            } ${clase.master?.lastname ?? ""}`.trim(),
            tema: clase.topic?.title ?? "Sin tema",
            aula: clase.classroom?.name ?? "Sin aula",
            start: clase.start_time?.slice(0, 5) ?? "",
            end: clase.end_time?.slice(0, 5) ?? "",
        }));

        setHorarios(nuevosHorarios);

        const verificarClaseActual = () => {
            const ahora = new Date();
            const horaActual = ahora.getHours().toString().padStart(2, "0");
            const minutosActuales = ahora
                .getMinutes()
                .toString()
                .padStart(2, "0");
            const tiempoActual = `${horaActual}:${minutosActuales}`;

            const claseEnCurso = nuevosHorarios.find((h: any) => {
                return tiempoActual >= h.start && tiempoActual < h.end;
            });

            setClaseActual(claseEnCurso || null);
        };

        verificarClaseActual();

        const intervalo = setInterval(verificarClaseActual, 60000);
        return () => clearInterval(intervalo);
    }, [data, group]);

    const aula = localStorage.getItem("aula_del_grupo");

    if (userRole === 1) {
        // Jef@ de grupo
        if (!group) {
            console.error("No hay grupo en localStorage");
            return null;
        }
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-5xl flex items-center justify-center rounded text-white">
                    <Schedule
                        grupo={group}
                        aula={aula ?? "Sin aula"}
                        horarios={horarios}
                    />
                </div>

                <div className="mt-10 bg-[#1e2022] flex flex-col items-center justify-center rounded text-white">
                    <Card
                        nameProfesor={claseActual?.profesor ?? "Sin profesor"}
                        nameMateria={
                            claseActual?.materia ?? "No hay materia actualmente"
                        }
                        Tema={claseActual?.tema ?? "-"}
                        Hora={claseActual?.hora ?? "-"}
                        mostrarBoton={!!claseActual}
                    />
                </div>
            </div>
        );
    } else if (userRole === 2) {
        // Maestr@
        const masterId = localStorage.getItem("master_id");

        return (
            <div className="text-white mt-10">
                <h1 className="text-3xl mb-4 text-center">
                    ¡Bienvenido Maestr@!
                </h1>
                <p className="text-center mb-6">
                    Justifica tus retardos o inasistencias aquí:
                </p>
                {masterId ? (
                    <JustificationForm masterId={masterId} />
                ) : (
                    <p className="text-center">No se encontró tu ID.</p>
                )}
            </div>
        );
    } else if (userRole === 3) {
        // Checador@
        return (
            <div className="text-white text-center mt-10">
                <h1 className="text-4xl text-white">¡Bienvenido {name}</h1>
                <GroupAttendance />
            </div>
        );
    } else if (userRole === 4) {
        // Jef@ de carrera
        return (
            <div className="text-white text-center mt-10">
                <h1>¡Bienvenid@ Jef@ de carrera!</h1>
                <p>Visualiza el control total de los horarios.</p>
            </div>
        );
    } else {
        return (
            <div className="text-white text-center mt-10">
                <p>Rol no reconocido.</p>
            </div>
        );
    }
}
