

interface Horario {
    hora: string;
    materia: string;
    profesor: string;
    tema: string;
}

interface ScheduleProps {
    grupo: string;
    aula: string;
    horarios: Horario[];
}

export default function Schedule({ grupo, aula, horarios }: ScheduleProps) {



    return (
        <div className="flex justify-center items-center rounded-2xl">
            <div className="w-full max-w-5xl  rounded-2xl shadow-lg overflow-hidden">
                {/* Encabezado */}
                <div className="bg-blue-800 text-white p-4 text-center text-xl font-bold">
                    Grupo {grupo} - {aula}
                </div>

                {/* Tabla */}
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3">Hora</th>
                            <th className="p-3">Materia</th>
                            <th className="p-3">Profesor</th>

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
                                <td className="p-3 text-center">{horario.tema}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
