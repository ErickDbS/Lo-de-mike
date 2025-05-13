import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import { CalendarPlus, ListPlus, Delete } from "lucide-react";
import { useForm } from "react-hook-form";
import GenerateNewScheduleRow from "./GenerateNewScheduleRow";
import { useEffect, useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";

const MySwal = withReactContent(Swal);

interface Row {
    id: number;
}

interface Data {
    value: string;
    label: string;
}

const FormComponent = () => {
    const { handleSubmit } = useForm();
    const [rows, setRows] = useState<Row[]>([]);
    const [groupId, setGroupId] = useState<any>();
    const [classroomId, setClassroomId] = useState<any>();
    const [groups, setGroups] = useState<any>();
    const [classrooms, setClassrooms] = useState<any>();

    // Carga inicial de grupos y salones
    useEffect(() => {
        async function loadMeta() {
            try {
                const [gRes, sRes] = await Promise.all([
                    fetch("https://schedulechecker.up.railway.app/api/groups"),
                    fetch("https://schedulechecker.up.railway.app/api/groups"),
                ]);
                if (!gRes.ok || !sRes.ok) {
                    throw new Error("Error al cargar datos");
                }
                const gruposJson = await gRes.json();
                const salonesJson = await sRes.json();
                setGroups(gruposJson);
                setClassrooms(salonesJson);
            } catch (err) {
                console.error(err);
                // Swal.fire({
                //     theme: "dark",
                //     icon: "error",
                //     title: "Oops...",
                //     text: "Error al cargar los datos! Intente más tarde.",
                // });
            }
        }

        loadMeta();
    }, []);

    const onSubmit = (data: object) => {
        console.log(data);
    };

    const GenerateNewRow = () => {
        setRows((prev) => [...prev, { id: prev.length }]);
    };

    // Dentro de FormComponent:
    const deleteRow = async (rowId: number) => {
        if (confirm("¿Está seguro que desea eliminar la fila?"))
            setRows((prev) => prev.filter((row) => row.id !== rowId));
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex justify-center gap-4">
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
                    <div className="grid grid-cols-2 gap-2 w-3/10 justify-center text-sm">
                        <p>Hora de inicio</p>
                        <p>Hora de fin</p>
                    </div>
                    <div className="mr-7 grid grid-cols-4 gap-2 w-full ml-2 justify-center text-sm">
                        <p>Profesor</p>
                        <p>Materia</p>
                        <p>Tema</p>
                        <p>Unidad</p>
                    </div>
                </div>
                <div className="mr-7">
                    <GenerateNewScheduleRow
                        groupId={groupId}
                        classroomId={classroomId}
                    />
                </div>

                {rows.map((row) => (
                    <div key={row.id} className="flex flex-row">
                        <GenerateNewScheduleRow
                            groupId={groupId}
                            classroomId={classroomId}
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
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
            className="group relative inline-block text-white h-6 flex flex-row"
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
