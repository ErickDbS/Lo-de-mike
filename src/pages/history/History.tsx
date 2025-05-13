import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import CheckCard from "../../components/Cards/CheckCard/CheckCard";

export default function History() {
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext.storage.role;

    switch (userRole) {
        case 1:
            return (
                <>
                    <div className="text-white grid place-items-start">
                        <CheckCard
                            nameMateria="Programación Web"
                            nameProfesor="Mike"
                            Tema="Introducción a la Programación"
                            Hora="21:00 - 22:00"
                            />
                    </div>
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
