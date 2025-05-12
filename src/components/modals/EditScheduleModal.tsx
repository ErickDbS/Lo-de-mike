import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

interface ScheduleEntry {
    time: string;
    subject: string;
    professor: string;
    days: { L: boolean; M: boolean; X: boolean; J: boolean; V: boolean };
    topic: string;
}

interface NewScheduleData {
    groupName: string;
    classroom: string;
    entries: ScheduleEntry[];
}

const MySwal = withReactContent(Swal);

export default function EditScheduleModal() {
    const showEditScheduleModal = async () => {
        const initialEntries: ScheduleEntry[] = [
            {
                time: "17:00 - 18:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "18:00 - 19:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "19:00 - 20:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "20:00 - 21:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "21:00 - 22:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "21:00 - 22:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
            {
                time: "21:00 - 22:00",
                subject: "",
                professor: "",
                days: { L: false, M: false, X: false, J: false, V: false },
                topic: "",
            },
        ];

        let groupNameInput: HTMLInputElement;
        let classroomInput: HTMLInputElement;
        const entryRefs: HTMLTableRowElement[] = [];

        const result = await MySwal.fire<NewScheduleData>({
            title: "Editar Horario",
            theme: "dark",
            html: (
                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    <input
                        id="groupName"
                        className="swal2-input"
                        placeholder="Nombre de grupo"
                    />
                    <input
                        id="classroom"
                        className="swal2-input"
                        placeholder="Aula"
                    />
                    <table className="table-auto w-full text-sm">
                        <thead>
                            <tr>
                                <th>Hora inicio</th>
                                <th>─</th>
                                <th>Hora fin</th>
                                <th>Materia</th>
                                <th>Profesor</th>
                                <th>L</th>
                                <th>M</th>
                                <th>X</th>
                                <th>J</th>
                                <th>V</th>
                                <th>Tema</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialEntries.map((entry, idx) => (
                                <tr
                                    key={idx}
                                    ref={(el) => {
                                        if (el) entryRefs.push(el);
                                    }}
                                >
                                    <td>
                                        <input
                                            type="text"
                                            data-idx={idx}
                                            data-field="start-time"
                                            className="swal2-input max-w-[100px] px-2 text-sm"
                                            style={{
                                                marginLeft: "1px",
                                                marginRight: "1px",
                                            }}
                                        />
                                    </td>
                                    <td>─</td>
                                    <td>
                                        <input
                                            type="text"
                                            data-idx={idx}
                                            data-field="end-time"
                                            className="swal2-input max-w-[100px] px-2 text-sm"
                                            style={{
                                                marginLeft: "1px",
                                                marginRight: "1px",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            data-idx={idx}
                                            data-field="subject"
                                            className="swal2-input"
                                            style={{
                                                marginLeft: "1px",
                                                marginRight: "1px",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            data-idx={idx}
                                            data-field="professor"
                                            className="swal2-input"
                                            style={{
                                                marginLeft: "1px",
                                                marginRight: "1px",
                                            }}
                                        />
                                    </td>
                                    {(["L", "M", "X", "J", "V"] as const).map(
                                        (day) => (
                                            <td
                                                key={day}
                                                className="text-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    data-idx={idx}
                                                    data-day={day}
                                                />
                                            </td>
                                        )
                                    )}
                                    <td>
                                        <input
                                            type="text"
                                            data-idx={idx}
                                            data-field="topic"
                                            className="swal2-input"
                                            style={{
                                                marginLeft: "1px",
                                                marginRight: "1px",
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ),
            width: "70%",
            confirmButtonText: "Guardar",
            confirmButtonColor: "#193cb8",
            showCancelButton: true,
            preConfirm: () => {
                groupNameInput = Swal.getPopup()?.querySelector(
                    "#groupName"
                ) as HTMLInputElement;
                classroomInput = Swal.getPopup()?.querySelector(
                    "#classroom"
                ) as HTMLInputElement;
                if (!groupNameInput.value || !classroomInput.value) {
                    Swal.showValidationMessage(
                        "El nombre del grupo y el aula son obligatorios"
                    );
                }

                const entries: ScheduleEntry[] = initialEntries.map(
                    (e, idx) => {
                        const row = entryRefs[idx];
                        const subject = (
                            row.querySelector(
                                `input[data-idx=\"${idx}\"][data-field=\"subject\"]`
                            ) as HTMLInputElement
                        ).value;
                        const professor = (
                            row.querySelector(
                                `input[data-idx=\"${idx}\"][data-field=\"professor\"]`
                            ) as HTMLInputElement
                        ).value;
                        const topic = (
                            row.querySelector(
                                `input[data-idx=\"${idx}\"][data-field=\"topic\"]`
                            ) as HTMLInputElement
                        ).value;
                        const daysChecks = ["L", "M", "X", "J", "V"].reduce(
                            (acc, d) => {
                                acc[d as keyof typeof e.days] = (
                                    row.querySelector(
                                        `input[data-idx=\"${idx}\"][data-day=\"${d}\"]`
                                    ) as HTMLInputElement
                                ).checked;
                                return acc;
                            },
                            {} as ScheduleEntry["days"]
                        );
                        return {
                            time: e.time,
                            subject,
                            professor,
                            days: daysChecks,
                            topic,
                        };
                    }
                );

                return {
                    groupName: groupNameInput.value,
                    classroom: classroomInput.value,
                    entries,
                };
            },
        });

        if (result.isConfirmed && result.value) {
            console.log("Nuevo horario:", result.value);
        }
    };

    return (
        // <Link
        //     className="group relative inline-block text-white h-6 flex flex-row"
        //     to="#"
        // onClick={(e) => {
        //     e.preventDefault();
        //     showScheduleModal();
        // }}
        //     title="Crear nuevo horario."
        // >
        //     <div className="flex fle-row gap-x-[3px]">
        //         <CalendarPlus />
        //         Crear horario
        //     </div>
        //     <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 group-hover:w-full"></span>
        // </Link>

        <Link
            to={""}
            onClick={(e) => {
                e.preventDefault();
                showEditScheduleModal();
            }}
            className="absolute end-6 top-4 hidden group-has-hover:block hover:scale-115 hover:cursor-pointer transition duration-300 ease-in-out text-yellow-500 animate-fade-left animate-ease-linear animate-duration-300 "
            title="Editar Horario"
        >
            <Pencil />
        </Link>
    );
}
