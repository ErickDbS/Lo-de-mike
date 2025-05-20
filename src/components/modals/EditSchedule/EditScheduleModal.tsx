import { Modal } from "rsuite";
import "rsuite/Modal/styles/index.css";
import "rsuite/Animation/styles/index.css";
import Swal from "sweetalert2";
import { ListPlus, Delete, CircleCheck, CircleX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";
import GenerateNewScheduleRowWithData from "./GenerateNewScheduleRowWithData";

interface Props {
    isOpen: boolean;
    onClose: any;
    onExited: any;
    career_Id: string;
    group_Id: string;
    classroom_id: string;
}

interface Row {
    id: number;
}

interface GrupoRaw {
    group_id: string;
    name: string;
    grade_level: number;
    active: string;
    created_at: Date | null;
    updated_at: Date | null;
}

interface classroomsData {
    id: number;
    name: string;
    active: string;
}

interface RowData {
    id: number;
    isComplete: boolean;
    data?: object;
    withData?: boolean;
}

export default function EditScheduleModal({
    career_Id,
    group_Id,
    classroom_id,
    isOpen,
    onClose,
    onExited,
}: Props) {
    const [groupId, setGroupId] = useState<any>(group_Id);
    const [classroomId, setClassroomId] = useState<any>(classroom_id);
    const [groups, setGroups] = useState<any>();
    const [classrooms, setClassrooms] = useState<any>();
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [withData, setWithData] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any>();
    const [rows, setRows] = useState<Row[]>([]);
    const [rowsData, setRowsData] = useState<RowData[]>([]);
    const hasGeneratedRows = useRef(false);

    // Carga inicial de grupos y salones
    useEffect(() => {
        async function loadMeta() {
            try {
                const [gRes, sRes, dRes] = await Promise.all([
                    fetch("https://schedulechecker.up.railway.app/api/groups"),
                    fetch(
                        "https://schedulechecker.up.railway.app/api/classrooms"
                    ),
                    fetch(
                        `https://schedulechecker.up.railway.app/api/class/career/${career_Id}/${group_Id}`
                    ),
                ]);
                if (!gRes.ok || !sRes.ok || !dRes.ok) {
                    throw new Error("Error al cargar datos");
                }

                // GRUPOS
                const groupsJson = await gRes.json();
                const groupsFormat = groupsJson.groups.map(
                    (data: GrupoRaw) => ({
                        label: data.name,
                        value: data.group_id,
                    })
                );
                setGroups(groupsFormat);

                // SALONES
                const classroomsJson = await sRes.json();
                const classroomsFormat = classroomsJson.classrooms.map(
                    (data: classroomsData) => ({
                        label: data.name,
                        value: data.id,
                    })
                );
                setClassrooms(classroomsFormat);

                // Datos del horario
                const SchedulesData = await dRes.json();
                setScheduleData(SchedulesData.classes);
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

    //Cargamos rows iniciales

    useEffect(() => {
        if (
            scheduleData &&
            scheduleData.length > 0 &&
            !hasGeneratedRows.current
        ) {
            GenerateInitialRows();
            hasGeneratedRows.current = true;
        }
    }, [scheduleData]);

    //Verificar salon, grupo y las rows
    useEffect(() => {
        const allRowsComplete =
            !!groupId &&
            !!classroomId &&
            rows.length !== 0 &&
            rowsData.length === rows.length &&
            rowsData.every((r) => r.isComplete);
        //verificar si hubo cambios en el formulario
        const isData =
            Boolean(groupId) ||
            Boolean(classroomId) ||
            rowsData.some((r) => r.withData);

        setIsComplete(allRowsComplete);
        setWithData(isData);
    }, [groupId, classroomId, rowsData]);

    const handleRowChange = useCallback(
        (id: number, isComplete: boolean, data?: any, withData?: boolean) => {
            setRowsData((old) => {
                const copy = [...old];
                const idx = copy.findIndex((r) => r.id === id);
                if (idx >= 0) {
                    copy[idx] = { id, isComplete, data, withData };
                }
                return copy;
            });
        },
        []
    );

    const onSubmit = async () => {
        const validPayloads = rowsData
            .map((r) => r.data)
            .filter((d): d is object => d !== undefined);
        try {
            const payload = validPayloads;
            const res = await fetch(
                "https://schedulechecker.up.railway.app/api/class",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();
            if (!res.ok) {
                throw json;
            }

            Swal.fire({
                theme: "dark",
                icon: "success",
                title: "¡Listo!",
                text: "Horario creado exitosamente.",
            });
        } catch (err: any) {
            Swal.fire({
                theme: "dark",
                icon: "error",
                title: err.message || "Error inesperado",
                text: err.errors || "Por favor inténtalo de nuevo.",
            });
        }
    };

    const GenerateInitialRows = () => {
        console.log("Schedule data", scheduleData);
        for (let i = 0; i < scheduleData.length; i++) {
            setRows((prev) => [...prev, { id: i }]);
            setRowsData((prev) => [
                ...prev,
                { id: i, isComplete: false, data: undefined },
            ]);
        }
    };

    const GenerateNewRow = () => {
        const allIds = rows.map((row) => row.id);
        const maxId = allIds.length > 0 ? Math.max(...allIds) : -1;
        const newId = maxId + 1;

        setRows((prev) => [...prev, { id: newId }]);
        setRowsData((prev) => [
            ...prev,
            { id: newId, isComplete: false, data: undefined },
        ]);
    };

    const deleteRow = (rowId: number) => {
        Swal.fire({
            title: "¿Está seguro de eliminar la linea?",
            text: "Si elimina esta linea perderá todos los datos que ingreso en ella.",
            theme: "dark",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setRows((prev) => prev.filter((r) => r.id !== rowId));
                setRowsData((prev) => prev.filter((r) => r.id !== rowId));
            } else {
                return;
            }
        });
    };

    const isExit = () => {
        if (withData) {
            Swal.fire({
                title: "¿Está seguro que desea salir?",
                text: "Si sale todos los cambios se perderán.",
                theme: "dark",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Salir",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    onClose();
                } else {
                    return;
                }
            });
        } else {
            onClose();
        }
    };

    return (
        <Modal
            backdrop="static"
            open={isOpen}
            onExited={onExited}
            onClose={onClose}
            size="90%"
            className="animate-fade-down animate-ease-in-out text-white "
        >
            <Modal.Header onClose={onClose} closeButton={false}>
                <div className="flex w-full justify-between items-center">
                    <h1 className="text-2xl font-bold">Editar Horario</h1>
                    <button
                        className="hover:text-red-500 hover:scale-135 cursor-pointer transition"
                        title="Salir"
                        onClick={isExit}
                    >
                        <X />
                    </button>
                </div>
            </Modal.Header>

            <Modal.Body className="">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4 items-center">
                        {!!groupId && !!classroomId ? (
                            <div title="Campos grupo y salón completos.">
                                <CircleCheck className="text-green-500 hover:scale-110" />
                            </div>
                        ) : (
                            <div title="Grupo y salón es requerido.">
                                <CircleX className="text-red-500 hover:scale-110" />
                            </div>
                        )}
                        <SelectPicker
                            data={groups}
                            placeholder="Grupo"
                            className="w-[224]"
                            onChange={(value) => setGroupId(value)}
                            value={groupId}
                        />
                        <SelectPicker
                            data={classrooms}
                            placeholder="Salón"
                            className="w-[224]"
                            onChange={(value) => setClassroomId(value)}
                            value={classroomId}
                        />
                    </div>

                    <div className="w-full flex flex-row ">
                        <div className="grid grid-cols-2 gap-2 w-3/10 justify-center text-sm font-bold ml-7">
                            <p>Hora de inicio</p>
                            <p>Hora de fin</p>
                        </div>
                        <div className="mr-7 grid grid-cols-4 gap-2 w-full ml-2 justify-center text-sm font-bold">
                            <p>Profesor</p>
                            <p>Materia</p>
                            <p>Unidad</p>
                            <p>Tema</p>
                        </div>
                    </div>

                    {rows.map((row) => {
                        // console.log(scheduleData[row.id]);
                        return (
                            <div key={row.id} className="flex flex-row">
                                <GenerateNewScheduleRowWithData
                                    key={row.id}
                                    id={row.id}
                                    groupId={groupId}
                                    classroomId={classroomId}
                                    onChange={handleRowChange}
                                    initData={scheduleData[row.id]}
                                />
                                <button
                                    onClick={() => deleteRow(row.id)}
                                    title="Eliminar fila"
                                    className="hover:text-red-500 w-7 cursor-pointer transition-colors h-9 hover:scale-105"
                                >
                                    <Delete className="ml-1" />
                                </button>
                            </div>
                        );
                    })}

                    <a
                        className="group cursor-pointer flex items-center justify-center flex-nowrap"
                        onClick={GenerateNewRow}
                        title="Agregar nueva linea"
                    >
                        <div className="flex-1 h-px bg-white mr-2 group-hover:bg-blue-500 transition-colors" />
                        <ListPlus className="group-hover:text-blue-500 transition-colors w-10" />
                        <p className="text-sm whitespace-nowrap mx-2 group-hover:text-blue-500 transition-colors ">
                            Agregar nueva línea
                        </p>
                        <div className="flex-1 h-px bg-white ml-2 group-hover:bg-blue-500 transition-colors" />
                    </a>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={onSubmit}
                    disabled={!isComplete}
                    title={!isComplete ? "Faltan datos por llenar." : ""}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mt-20 w-full"
                >
                    Guardar
                </button>
            </Modal.Footer>
        </Modal>
    );
}
