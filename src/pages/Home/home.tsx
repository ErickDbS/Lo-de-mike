export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Se mostrara el horario ya sea del maestro o alumno, con la fila resaltada de la hora actual de clases */}
            <div className="h-70 w-150 bg-[#1e2022] flex items-center justify-center m-10 rounded text-white">
                <h1>Horario</h1>
            </div>

            {/* Se mostrara la hora actual, junto con la materia y profesor que toque y habra un campo para marcar su falta, o asistencia, cabe recalcar que la falta solo se marcara si pasan los minutos de tolerancia */}
            <p className="text-gray-300">
                Se mostrara la hora actual, junto con la materia y profesor que
                toque y habra un campo para marcar su falta, o asistencia, cabe
                recalcar que la falta solo se marcara si pasan los minutos de
                tolerancia{" "}
            </p>
            <div className="h-80 w-100 bg-[#1e2022] flex flex-col items-center justify-center rounded text-white">
                <h1>Materia: Redes Neuronales Artificiales</h1>
                <h1>Profesor: Edgar</h1>
                <button className="bg-blue-800 p-4 rounded-md cursor-pointer">
                    {" "}
                    Marcar falta
                </button>
            </div>
        </div>
    );
}
