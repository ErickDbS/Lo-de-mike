import Schedule from "./Schedule";

export default function Prueba(){
const horarios = [
    {hora: "17:00 - 18:00", materia: "la de Edgar", profesor: "El Edgar", tema: "el que da Edgar"},
    {hora: "18:00 - 19:00", materia: "la de Mike", profesor: "El Mike", tema: "el que da Mike"},
    {hora: "19:00 - 20:00", materia: "la de Herman", profesor: "El Herman", tema: "el que da Herman"},
    {hora: "20:00 - 21:00", materia: "la de Mirsa", profesor: "El Mirsa", tema: "el que da Mirsa"},
    {hora: "21:00 - 22:00", materia: "la de Rocio", profesor: "La Rocio", tema: "el que da Rocio"},
]

    return (
        <>

            <Schedule
                grupo="4-03-IS"
                aula="Aula 20"
                horarios={horarios}
            >
                
            </Schedule>

        </>
    )
}