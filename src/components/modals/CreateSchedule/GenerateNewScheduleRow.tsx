import TimePicker from "rsuite/esm/TimePicker";
import "rsuite/TimePicker/styles/index.css";
import { useEffect, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";
import { CircleCheck, CircleX } from "lucide-react";

interface Props {
    id: number;
    groupId: string;
    classroomId: string;
    onChange: any;
}

interface Data {
    value: string;
    label: string;
}

const MATERIAS: Data[] = [
    { value: "1", label: "SISTEMAS OPERATIVOS" },
    { value: "2", label: "MATEMÁTICAS DISCRETAS" },
    { value: "3", label: "PROGRAMACIÓN II" },
    { value: "4", label: "REDES I" },
];

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
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [json, setJson] = useState<object>();
    const [allFilledRow, setAllFilledRow] = useState<boolean>(false);

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

    // console.log("Datos completos?", isComplete, "Data", json);

    return (
        <div className="flex flex-row w-full items-center">
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
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                        value={master}
                        onChange={(value) => setMaster(value)}
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                        value={subject}
                        onChange={(value) => setSubject(value)}
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                        value={topic}
                        onChange={(value) => setTopic(value)}
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                        value={unit}
                        onChange={(value) => setUnit(value)}
                    />
                </div>
            </form>
        </div>
    );
}
