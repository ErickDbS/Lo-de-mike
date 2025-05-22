import SearchBar from "../../components/SearchComponent/SearchBar";
import ScheduleAdmin from "../../components/schedule/ScheduleAdmin";
import { LoaderCircle } from "lucide-react";
import { useGETSchedules } from "../../hooks/useGETSchedules";

export default function HomeJefa() {
    const schedules = useGETSchedules();

    //Ordenar data por grupos
    const dataOrder = () => {
        if (schedules.data) {
            const orderData = schedules.data.classes.reduce(
                (acc: any, row: any) => {
                    const groupName = row.group?.name?.trim();
                    if (!groupName) {
                        console.warn("Clase sin nombre de grupo válido:", row);
                        return acc;
                    }
                    if (!acc[groupName]) {
                        acc[groupName] = [];
                    }
                    acc[groupName].push(row);
                    return acc;
                },
                {} as Record<string, any[]>
            );

            return Object.values(orderData);
        }
    };

    const groupData = dataOrder();
    return (
        <>
            <div className="flex flex-row w-full mb-2 overflow-hidden">
                <h1 className="text-white text-xl font-bold w-1/8 justify-center content-center ml-4">
                    Lista de horarios
                </h1>
                <SearchBar />
            </div>
            {schedules.isLoading ? (
                <div className="flex w-full h-[calc(100svh_-_13rem)] justify-center text-center items-center bg-[#1e2022] rounded-lg">
                    <LoaderCircle className="animate-spin text-white h-15 w-15" />
                </div>
            ) : (
                <div className="w-full h-[calc(100svh_-_13rem)] bg-[#1e2022] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto">
                    {groupData?.map((schedule: any, index: any) => {
                        console.log("schedule", schedule);
                        return (
                            <ScheduleAdmin
                                key={index}
                                grupo={schedule[0].group.name}
                                carrera={schedule[0].career.career}
                                aula={schedule[0].classroom.name}
                                horarios={schedule}
                                onUpdated={schedules.refetch}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}
