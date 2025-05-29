import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import CheckCard from "../../components/Cards/CheckCard/CheckCard";
import JustificationHistory from "../../components/JustificationsHistory/JustificationsHystory";

export default function History() {
    const authContext = useContext(AuthContext) as any;
    const userRole: any = authContext.storage.role;

    switch (userRole) {
        case 1:
            return (
                <>
                    <div className="text-white grid place-items-start">
                    </div>
                </>
            );
            break;
        case 2:
            const masterId = localStorage.getItem("master_id");
            return (
                <>
                    <JustificationHistory masterId={masterId ?? "sin masterid en localstorage"} />
                </>
            );
            break;

        default:
            break;
    }
}
