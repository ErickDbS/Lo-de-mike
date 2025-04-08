export default function History() {
    const userRole: string = "maestro";

    switch (userRole) {
        case "jefe":
            return (
                <>
                    <h1 className="text-white">
                        Aqui se mostrara el historial de clases pasadas y
                        asistencia de los profesores.
                    </h1>
                </>
            );
            break;
        case "maestro":
            return (
                <>
                    <h1 className="text-white">POnganse al tiro</h1>
                </>
            );
            break;

        default:
            break;
    }
}
