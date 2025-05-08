interface CardProps {
    nameProfesor: string;
    nameMateria: string;
    Hora: string;
}

export default function Card({ nameProfesor, nameMateria, Hora }: CardProps) {
    return (
        <>
            <div className="grid place-items-center">
                <div className="text-white text-4xl border border-solid border-gray-300/20  rounded-xl w-100 grid place-items-center ">
                    <div className="text-xl pt-5">
                        <p>
                            <strong className="pt-1 text-blue-500">
                                Materia:
                            </strong>{" "}
                            {nameProfesor}
                        </p>
                        <p>
                            <strong className="pt-1 text-blue-500">
                                Profesor:{" "}
                            </strong>{" "}
                            {nameMateria}
                        </p>
                        <p>
                            <strong className="pt-1 text-blue-500">
                                Hora:{" "}
                            </strong>{" "}
                            {Hora}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-800 px-5 py-4 mt-3 mb-3 rounded-xl cursor-pointer text-xl hover:bg-blue-900 transition"
                    >
                        Marcar Asistencia
                    </button>
                </div>
            </div>
        </>
    );
}
