import TimePicker from "rsuite/esm/TimePicker";
import "rsuite/TimePicker/styles/index.css";
import { useEffect, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";
import { CircleCheck, CircleX } from "lucide-react";
import Swal from "sweetalert2";
import AlertDialog from "../../Alerts/AlertDialog";

interface Props {
    id: number;
    groupId: string;
    classroomId: string;
    onChange: any;
}

interface MastersData {
    master_id: number;
    name: string;
    lastname: string;
    acronym: string;
    active: string;
}

interface SubjectsData {
    subject_id: number;
    name: string;
    code: number;
    description: string;
    credits: number;
    hours: number;
    semester: number;
    plan_year: number;
    career_id: number;
    active: string;
}

interface UnitsData {
    unit_id: number;
    subject_id: number;
    title: string;
    unit_number: number;
    active: string;
}

interface TopicsData {
    topic_id: number;
    unit_id: number;
    title: string;
    description: string;
    topic_order: number;
    active: string;
}

const formatTime = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export default function GenerateNewScheduleRow({
    id,
    groupId,
    classroomId,
    onChange,
}: Props) {
    //datos
    const [startTime, setStartTime] = useState<any>();
    const [endTime, setEndTime] = useState<any>();
    const [master, setMaster] = useState<any>();
    const [subject, setSubject] = useState<any>();
    const [topic, setTopic] = useState<any>();
    const [unit, setUnit] = useState<any>();
    const [isUnitDisable, setUnitDisable] = useState<any>(true);
    const [isTopicDisable, setTopicDisable] = useState<any>(true);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [json, setJson] = useState<object>();
    const [allFilledRow, setAllFilledRow] = useState<boolean>(false);
    //modal
    const [open, setOpen] = useState(false);
    const [modalIcon, setModalIcon] = useState<any>();
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    //States data
    const [masters, setMasters] = useState<any>();
    const [subjects, setSubjects] = useState<any>();
    const [topics, setTopics] = useState<any>();
    const [units, setUnits] = useState<any>();

    // Carga inicial de los datos
    useEffect(() => {
        async function loadMeta() {
            try {
                const [mastersRes, subjectsRes] = await Promise.all([
                    fetch("https://schedulechecker.up.railway.app/api/masters"),
                    fetch(
                        "https://schedulechecker.up.railway.app/api/subjects"
                    ),
                ]);
                if (!mastersRes.ok || !subjectsRes.ok) {
                    throw new Error("Error al cargar datos");
                }
                // MAESTROS
                const mastersJson = await mastersRes.json();
                const mastersFormat = mastersJson.masters.map(
                    (data: MastersData) => ({
                        label: `${data.acronym} ${data.lastname} ${data.name} `,
                        value: data.master_id,
                    })
                );
                setMasters(mastersFormat);

                // MATERIAS
                const subjectsJson = await subjectsRes.json();
                const subjectsFormat = subjectsJson.subjects.map(
                    (data: SubjectsData) => ({
                        label: data.name,
                        value: data.subject_id,
                    })
                );
                setSubjects(subjectsFormat);
            } catch (err) {
                console.error(err);
                Swal.fire({
                    theme: "dark",
                    icon: "error",
                    title: "Oops...",
                    text: "Error al cargar los datos! Intente más tarde.",
                });
            }
        }

        loadMeta();
    }, []);

    useEffect(() => {
        const allFilled =
            !!groupId &&
            !!classroomId &&
            !!startTime &&
            !!endTime &&
            !!master &&
            !!subject &&
            !!topic &&
            !!unit;

        setAllFilledRow(
            !!startTime &&
                !!endTime &&
                !!master &&
                !!subject &&
                !!topic &&
                !!unit
        );

        const payload = allFilled
            ? {
                  group_id: groupId,
                  classroom_id: classroomId,
                  subject_id: subject,
                  master_id: master,
                  topic_id: topic,
                  unit_id: unit,
                  start_time: startTime,
                  end_time: endTime,
              }
            : undefined;

        setIsComplete(allFilled);
        setJson(payload);
        onChange(id, allFilled, payload);
    }, [
        startTime,
        endTime,
        master,
        subject,
        topic,
        unit,
        groupId,
        classroomId,
        id,
        onChange,
    ]);

    const onChangeSubject = async (value: any) => {
        setSubject(value);
        //si hay una opcion elegida hago la peticion
        if (value) {
            try {
                const [unitsRes] = await Promise.all([
                    fetch(
                        `https://schedulechecker.up.railway.app/api/units/subjects/${value}`
                    ),
                ]);
                if (!unitsRes.ok) throw new Error("Error al cargar datos");
                // Unidades
                const unitsJson = await unitsRes.json();
                const unitsFormat = unitsJson.units.map((data: UnitsData) => ({
                    label: `${data.unit_number} ${data.title}`,
                    value: data.unit_id,
                }));
                setUnits(unitsFormat);
            } catch (err) {
                console.error(err);
                setModal(
                    "error",
                    "Oops...",
                    "La materia no cuenta con unidades. Intente con otra materia."
                );
            }
        }

        //Activo o desactivo el campo de la unidad
        setUnitDisable(value === null);
    };

    const onChangeUnits = async (value: any) => {
        setUnit(value);
        //si hay una opcion elegida hago la peticion
        if (value) {
            try {
                const [topicsRes] = await Promise.all([
                    fetch(
                        `https://schedulechecker.up.railway.app/api/topics/unit/${value}`
                    ),
                ]);
                if (!topicsRes.ok) throw new Error("Error al cargar datos");
                // Unidades
                const topicsJson = await topicsRes.json();
                const topicsFormat = topicsJson.topics.map(
                    (data: TopicsData) => ({
                        label: data.title,
                        value: data.topic_id,
                    })
                );
                setTopics(topicsFormat);
            } catch (err) {
                console.error(err);
                setModal(
                    "error",
                    "Oops...",
                    "La unidad no cuenta con temas. Intente con otra unidad."
                );
            }
        }

        //Activo o desactivo el campo del tema
        setTopicDisable(value === null);
    };

    const setModal = (icon: string, title: string, message: string) => {
        setModalIcon(icon);
        setModalTitle(title);
        setModalMessage(message);
        setOpen(true);
    };

    return (
        <div className="flex flex-row w-full items-center">
            <AlertDialog
                isOpen={open}
                onClose={() => setOpen(false)}
                icon={modalIcon}
                title={modalTitle}
                message={modalMessage}
                textButton="Ok"
                colorButton="blue"
            />
            {allFilledRow ? (
                <div title="Campos completos" className="w-7 h-9 mr-1">
                    <CircleCheck className="text-green-500 hover:scale-110" />
                </div>
            ) : (
                <div title="Faltan campos por llenar" className="w-7 h-9 mr-1">
                    <CircleX className="text-red-500 hover:scale-110" />
                </div>
            )}
            <form className="flex flex-row justify-between w-full mb-3">
                <div className="grid grid-cols-2 gap-2 w-3/10">
                    <TimePicker
                        className=""
                        format="hh:mm aa"
                        showMeridiem
                        container={document.body}
                        onChange={(value) => setStartTime(formatTime(value))}
                    />
                    <TimePicker
                        className=""
                        format="hh:mm aa"
                        showMeridiem
                        container={document.body}
                        onChange={(value) => setEndTime(formatTime(value))}
                    />
                </div>
                <div className="grid grid-cols-4 gap-2 w-full ml-2">
                    <SelectPicker
                        data={masters}
                        placeholder=""
                        className="w-[224]"
                        value={master}
                        onChange={(value) => setMaster(value)}
                    />
                    <SelectPicker
                        data={subjects}
                        placeholder=""
                        className="w-[224]"
                        value={subject}
                        onChange={(value) => onChangeSubject(value)}
                    />
                    <div
                        title={
                            isUnitDisable && "Primero seleccione una materia."
                        }
                        className="w-full"
                    >
                        <SelectPicker
                            disabled={isUnitDisable}
                            data={units}
                            placeholder=""
                            className="w-full"
                            value={unit}
                            onChange={(value) => onChangeUnits(value)}
                        />
                    </div>
                    <div
                        title={
                            isTopicDisable && "Primero seleccione una unidad."
                        }
                        className="w-full"
                    >
                        <SelectPicker
                            disabled={isTopicDisable}
                            data={topics}
                            placeholder=""
                            className="w-full"
                            value={topic}
                            onChange={(value) => setTopic(value)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
