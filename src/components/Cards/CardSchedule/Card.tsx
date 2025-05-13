interface CardProps {
    nameProfesor: string;
    nameMateria: string;
    Tema:string;
    Hora: string;
    mostrarBoton: boolean;
}

export default function Card({ nameProfesor, nameMateria, Hora, Tema, mostrarBoton }: CardProps) {
    return (
        <>
            <div className="grid place-items-center">
                <div className="text-white text-4xl border border-solid rounded-xl w-100 grid place-items-center bg-gray-900">
                    <div className="text-xl pt-5">
                        <p>
                            <strong className="pt-1 text-blue-800">
                                Materia:
                            </strong>{" "}
                            {nameProfesor}
                        </p>
                        <p>
                            <strong className="pt-1 text-blue-800">
                                Profesor:{" "}
                            </strong>{" "}
                            {nameMateria}
                        </p>
                        <p>
                            <strong className="pt-1 text-blue-800">
                                Tema:{" "}
                            </strong>{" "}
                            {Tema}
                        </p>
                        <p>
                            <strong className="pt-1 text-blue-800">
                                Hora:{" "}
                            </strong>{" "}
                            {Hora}
                        </p>
                    </div>
                    {mostrarBoton && (
                        <button
                        type="submit" 
                        className="mt-4 mb-4 px-4 py-2 bg-blue-800 rounded-[10px] text-3xl cursor-pointer hover:bg-blue-900"
                        >
                            Marcar asistencia
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
