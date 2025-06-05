interface CardProps {
    nameProfesor: string;
    nameMateria: string;
    Tema: string;
    Hora: string;
    mostrarBoton: boolean;
}

export default function Card({
    nameProfesor,
    nameMateria,
    Hora,
    Tema,
}: CardProps) {
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
                </div>
            </div>
        </>
    );
}
