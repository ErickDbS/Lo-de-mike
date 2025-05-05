import PersonalCard from "../../components/Cards/PersonalCard/PersonalCard"

export default function Schedule() {
    const materias = [
        { nameMateria: "Programación Web", nameProfesor: "Mike", Hora: "21:00 - 22:00" },
        { nameMateria: "Bases de Datos", nameProfesor: "Laura", Hora: "19:00 - 20:00" },
        { nameMateria: "Redes", nameProfesor: "Carlos", Hora: "20:00 - 21:00" },
        { nameMateria: "Matemáticas Discretas", nameProfesor: "Ana", Hora: "16:00 - 17:00" },
        { nameMateria: "Sistemas Operativos", nameProfesor: "Luis", Hora: "17:00 - 18:00" },
        { nameMateria: "Inteligencia Artificial", nameProfesor: "Sofía", Hora: "15:00 - 16:00" },
        { nameMateria: "Ingeniería de Software", nameProfesor: "Andrés", Hora: "14:00 - 15:00" },
        { nameMateria: "Estructuras de Datos", nameProfesor: "Elena", Hora: "13:00 - 14:00" },
        { nameMateria: "Diseño de Interfaces", nameProfesor: "Pedro", Hora: "12:00 - 13:00" },
        { nameMateria: "Arquitectura de Computadoras", nameProfesor: "Julia", Hora: "11:00 - 12:00" },
    ];
    return (
        <>
            <div className='grid place-items-start text-white'>
                <p className='text-2xl mb-5'>Control de Asistencias</p>
            </div>

            <div className="text-white grid place-items-start">
            {materias.map((materia, index) => (
                <PersonalCard
                    key={index}
                    nameMateria={materia.nameMateria}
                    nameProfesor={materia.nameProfesor}
                    Hora={materia.Hora}
                />
            ))}
            </div>
        </>
    )
}