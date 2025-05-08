import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";

export default function History() {
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext.storage.role;

    switch (userRole) {
        case 1:
            return (
                <>
                    <h1 className="text-white">
                        Aqui se mostrará una lista de clases pasadas y
                        asistencia de los profesores.
                    </h1>
                </>
            );
            break;
        case 2:
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
