export default function History() {
    const userRole: string = "maestro";

    switch (userRole) {
        case "jefe":
            return (
                <>
                    <h1 className="text-white">
                        Aqui se mostrará una lista de clases pasadas y
                        asistencia de los profesores.
                    </h1>
                </>
            );
            break;
        case "maestro":
            return (
                <>
                    <h1 className="text-white">
                        Aquí el profesor podrá ver una lista de sus clases
                        pasadas y justificar sus faltas o retardos.
                    </h1>
                </>
            );
            break;

        default:
            break;
    }
}
