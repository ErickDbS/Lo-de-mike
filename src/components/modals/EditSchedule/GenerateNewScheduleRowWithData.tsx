import TimePicker from "rsuite/esm/TimePicker";
import "rsuite/TimePicker/styles/index.css";
import { useEffect, useRef, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";
import { CircleCheck, CircleX } from "lucide-react";
import Swal from "sweetalert2";
import { useGETMasters } from "../../../hooks/useGETMasters";
import { useGETSubjects } from "../../../hooks/useGETSubjects";
import { useGETTopics } from "../../../hooks/useGETTopics";
import { useGETUnits } from "../../../hooks/useGETUnits";

interface Props {
    id: number;
    groupId: string;
    classroomId: string;
    onChange: any;
    initData: any;
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

export default function GenerateNewScheduleRowWithData({
    id,
    groupId,
    classroomId,
    onChange,
    initData,
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
    const [, setIsComplete] = useState<boolean>(false);
    const [, setJson] = useState<object>();
    const [withData, setWithData] = useState<boolean>(false);
    const [allFilledRow, setAllFilledRow] = useState<boolean>(false);
    const isFirstSubjectLoad = useRef(true);

    //Peticiones
    const queryMasters = useGETMasters();
    const querySubjects = useGETSubjects();
    const queryUnits = useGETUnits(subject);
    const queryTopics = useGETTopics(unit);

    //States data
    const [masters, setMasters] = useState<any>();
    const [subjects, setSubjects] = useState<any>();
    const [topics, setTopics] = useState<any>();
    const [units, setUnits] = useState<any>();

    useEffect(() => {
        const subjId = initData?.subject?.subject_id;
        const unitId = initData?.unit?.unit_id;
        const masterId = initData?.master?.master_id;
        const topicId = initData?.topic?.topic_id;
        const { start_time, end_time } = initData || {};

        if (subjId && unitId && masterId && topicId && start_time && end_time) {
            setSubject(subjId);
            setUnit(unitId);
            setMaster(masterId);
            setTopic(topicId);
            setStartTime(parseTimeStringToDate(start_time));
            setEndTime(parseTimeStringToDate(end_time));
        }
    }, [initData]);

    // Carga inicial de los datos
    useEffect(() => {
        if (queryMasters.error || querySubjects.error) {
            Swal.fire({
                theme: "dark",
                icon: "error",
                title: "Oops...",
                text: "Error al cargar los datos! Intente más tarde.",
            });
        } else if (queryMasters.isSuccess && querySubjects.isSuccess) {
            // Profesores
            const mastersFormat = queryMasters.data.masters.map(
                (data: MastersData) => ({
                    label: `${data.acronym} ${data.lastname} ${data.name}`,
                    value: data.master_id,
                })
            );
            setMasters(mastersFormat);

            // Materias
            const subjectsFormat = querySubjects.data.subjects.map(
                (data: SubjectsData) => ({
                    label: `${data.name} - Semestre ${data.semester}`,
                    value: data.subject_id,
                })
            );
            setSubjects(subjectsFormat);
        }
    }, [
        queryMasters.data,
        queryMasters.error,
        queryMasters.isSuccess,
        querySubjects.data,
        querySubjects.error,
        querySubjects.isSuccess,
    ]);

    useEffect(() => {
        let allFilled =
            !!groupId &&
            !!classroomId &&
            !!startTime &&
            !!endTime &&
            !!master &&
            !!subject &&
            !!topic &&
            !!unit;

        if (isLab()) {
            allFilled =
                !!groupId &&
                !!classroomId &&
                !!startTime &&
                !!endTime &&
                !!master &&
                !!subject;
        }

        setWithData(
            !!(startTime || endTime || master || subject || topic || unit)
        );

        if (isLab())
            setWithData(
                !!groupId &&
                    !!classroomId &&
                    !!startTime &&
                    !!endTime &&
                    !!master &&
                    !!subject
            );

        setAllFilledRow(
            !!startTime &&
                !!endTime &&
                !!master &&
                !!subject &&
                !!topic &&
                !!unit
        );

        if (isLab())
            setAllFilledRow(!!startTime && !!endTime && !!master && !!subject);

        const payload = allFilled
            ? {
                  group_id: groupId,
                  classroom_id: classroomId,
                  subject_id: subject,
                  master_id: master,
                  topic_id: topic,
                  unit_id: unit,
                  start_time: formatTime(startTime),
                  end_time: formatTime(endTime),
              }
            : undefined;

        setIsComplete(allFilled);
        setJson(payload);
        onChange(id, allFilled, payload, withData);
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
        withData,
        onChange,
    ]);

    const isLab = (): boolean => {
        if (!subjects || !subject) return false;
        const nameSubject = subjects
            .find((sub: any) => sub.value === subject)
            .label.split(" ");
        return nameSubject[0] === "LABORATORIO";
    };

    const parseTimeStringToDate = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0, 0); // hh, mm, ss, ms
        return date;
    };

    //Recargar las unidades dependiendo la materia
    useEffect(() => {
        if (queryUnits.error) {
            //Si la materia es un laboratorio.
            if (isLab()) {
                Swal.fire({
                    theme: "dark",
                    icon: "info",
                    title: "¡Importante!",
                    text: "Los laboratorios no cuentan con unidades ni temas.",
                });
            } else {
                Swal.fire({
                    theme: "dark",
                    icon: "error",
                    title: "Oops...",
                    text: "La materia no cuenta con unidades. Intente con otra materia.",
                });
            }
            setUnitDisable(true);
            setTopicDisable(true);
            setUnits([]);
            setTopics([]);
            setUnit("");
            setTopic("");
        } else if (queryUnits.isSuccess) {
            const unitsFormat = queryUnits.data.units.map(
                (data: UnitsData) => ({
                    label: `U${data.unit_number}.- ${data.title}`,
                    value: data.unit_id,
                })
            );
            setUnitDisable(false);
            setTopicDisable(true);
            setTopics([]);
            setUnits(unitsFormat);
            if (isFirstSubjectLoad.current) {
                isFirstSubjectLoad.current = false;
                return;
            }
            setTopic("");
            setUnit("");
        }
    }, [queryUnits.error, queryUnits.isSuccess, queryUnits.data, subject]);

    //Recargar los temas dependiendo la unidad
    useEffect(() => {
        if (queryTopics.error) {
            Swal.fire({
                theme: "dark",
                icon: "error",
                title: "Oops...",
                text: "La unidad no cuenta con temas. Intente con otra unidad.",
            });
            setUnits([]);
        } else if (queryTopics.isSuccess) {
            const topicsFormat = queryTopics.data.topics.map(
                (data: TopicsData) => ({
                    label: data.title,
                    value: data.topic_id,
                })
            );
            setTopicDisable(false);
            setTopics(topicsFormat);
        }
    }, [queryTopics.error, queryTopics.isSuccess, queryTopics.data, unit]);

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
                        onChange={(value) => setStartTime(value)}
                        value={startTime}
                    />
                    <TimePicker
                        className=""
                        format="hh:mm aa"
                        showMeridiem
                        container={document.body}
                        onChange={(value) => setEndTime(value)}
                        value={endTime}
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
                        onChange={(value) => setSubject(value)}
                    />
                    <div
                        title={
                            isLab()
                                ? "Los laboratorios no cuentan con unidades ni temas."
                                : isUnitDisable &&
                                  "Primero seleccione una materia."
                        }
                        className="w-full"
                    >
                        <SelectPicker
                            disabled={isUnitDisable}
                            data={units}
                            placeholder=""
                            className="w-full"
                            onChange={(value) => setUnit(value)}
                            value={unit}
                        />
                    </div>
                    <div
                        title={
                            isLab()
                                ? "Los laboratorios no cuentan con unidades ni temas."
                                : isTopicDisable &&
                                  "Primero seleccione una unidad."
                        }
                        className="w-full"
                    >
                        <SelectPicker
                            disabled={isTopicDisable}
                            data={topics}
                            placeholder=""
                            className="w-full"
                            onChange={(value) => setTopic(value)}
                            value={topic}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
