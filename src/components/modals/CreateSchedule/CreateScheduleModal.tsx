import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import {
    CalendarPlus,
    ListPlus,
    Delete,
    CircleCheck,
    CircleX,
} from "lucide-react";
import { useForm } from "react-hook-form";
import GenerateNewScheduleRow from "./GenerateNewScheduleRow";
import { useCallback, useEffect, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";
import { useFetch } from "../../../hooks/useFetch";
import AlertDialog from "../../Alerts/AlertDialog";

const MySwal = withReactContent(Swal);

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
}

const FormComponent = () => {
    const { handleSubmit } = useForm();
    const [rows, setRows] = useState<Row[]>([]);
    const [groupId, setGroupId] = useState<any>();
    const [classroomId, setClassroomId] = useState<any>();
    const [groups, setGroups] = useState<any>();
    const [classrooms, setClassrooms] = useState<any>();
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [rowsData, setRowsData] = useState<RowData[]>([]);
    const { data, error: fetchError, doFetch } = useFetch(null, null);
    //modal
    const [open, setOpen] = useState(false);
    const [modalIcon, setModalIcon] = useState<any>();
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    // Carga inicial de grupos y salones
    useEffect(() => {
        GenerateNewRow();
        async function loadMeta() {
            try {
                const [gRes, sRes] = await Promise.all([
                    fetch("https://schedulechecker.up.railway.app/api/groups"),
                    fetch(
                        "https://schedulechecker.up.railway.app/api/classrooms"
                    ),
                ]);
                if (!gRes.ok || !sRes.ok) {
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
        if (data) {
            Swal.fire("Horario creado exitosamente", "success");
        }
    }, [data]);

    useEffect(() => {
        if (fetchError) {
            setModal("error", fetchError.message, fetchError.errors);
        }
    }, [fetchError]);

    //Verificar salon, grupo y las rows
    useEffect(() => {
        const allRowsComplete =
            !!groupId &&
            !!classroomId &&
            rows.length !== 0 &&
            rowsData.length === rows.length &&
            rowsData.every((r) => r.isComplete);

        setIsComplete(allRowsComplete);
    }, [groupId, classroomId, rowsData]);

    const setModal = (icon: string, title: string, message: string) => {
        setModalIcon(icon);
        setModalTitle(title);
        setModalMessage(message);
        setOpen(true);
    };

    const handleRowChange = useCallback(
        (id: number, isComplete: boolean, data?: any) => {
            setRowsData((old) => {
                const copy = [...old];
                const idx = copy.findIndex((r) => r.id === id);
                if (idx >= 0) {
                    copy[idx] = { id, isComplete, data };
                }
                return copy;
            });
        },
        []
    );

    const onSubmit = () => {
        const validPayloads = rowsData
            .map((r) => r.data)
            .filter((d): d is object => d !== undefined);
        console.log(validPayloads);

        doFetch("https://schedulechecker.up.railway.app/api/class", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validPayloads),
        });
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
        if (!confirm("¿Seguro?")) return;
        setRows((prev) => prev.filter((r) => r.id !== rowId));
        setRowsData((prev) => prev.filter((r) => r.id !== rowId));
    };

    console.log("rows", rows);

    return (
        <>
            <AlertDialog
                isOpen={open}
                onClose={() => setOpen(false)}
                icon={modalIcon}
                title={modalTitle}
                message={modalMessage}
                textButton="Ok"
                colorButton="blue"
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
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
                    />
                    <SelectPicker
                        data={classrooms}
                        placeholder="Salón"
                        className="w-[224]"
                        onChange={(value) => setClassroomId(value)}
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

                {rows.map((row) => (
                    <div key={row.id} className="flex flex-row">
                        <GenerateNewScheduleRow
                            key={row.id}
                            id={row.id}
                            groupId={groupId}
                            classroomId={classroomId}
                            onChange={handleRowChange}
                        />
                        <button
                            onClick={() => deleteRow(row.id)}
                            title="Eliminar fila"
                            className="hover:text-red-500 w-7 cursor-pointer transition-colors h-9 hover:scale-105"
                        >
                            <Delete className="ml-1" />
                        </button>
                    </div>
                ))}

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

                <button
                    type="submit"
                    disabled={!isComplete}
                    title={!isComplete ? "Faltan datos por llenar." : ""}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mt-20"
                >
                    Guardar
                </button>
            </form>
        </>
    );
};

const showScheduleModal = () => {
    MySwal.fire({
        title: "Crear Nuevo Horario",
        theme: "dark",
        html: <FormComponent />,
        width: "90%",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        preConfirm: () => {},
    });
};

function CreateScheduleModal() {
    return (
        <Link
            className="group relative text-white h-6 flex flex-row"
            to="#"
            onClick={(e) => {
                e.preventDefault();
                showScheduleModal();
            }}
            title="Crear nuevo horario."
        >
            <div className="flex fle-row gap-x-[3px]">
                <CalendarPlus />
                Crear horario
            </div>
            <span className="absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

export default CreateScheduleModal;
