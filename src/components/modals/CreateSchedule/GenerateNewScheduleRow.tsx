import { useForm } from "react-hook-form";
import TimePicker from "rsuite/esm/TimePicker";
import "rsuite/TimePicker/styles/index.css";
import { useState } from "react";
import SelectPicker from "rsuite/SelectPicker";
import "rsuite/SelectPicker/styles/index.css";

interface Materias {
    value: string;
    label: string;
}

const MATERIAS: Materias[] = [
    { value: "1", label: "SISTEMAS OPERATIVOS" },
    { value: "2", label: "MATEMÁTICAS DISCRETAS" },
    { value: "3", label: "PROGRAMACIÓN II" },
    { value: "4", label: "REDES I" },
];

export default function GenerateNewScheduleRow() {
    const { register, handleSubmit } = useForm();
    const [time, setTime] = useState<any>();

    console.log("time", time);
    const onSubmit = (data: object) => {
        console.log(data);
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-row justify-between w-full"
            >
                <TimePicker
                    className=""
                    format="hh:mm aa"
                    showMeridiem
                    value={time}
                    container={document.body}
                    onChange={(value) => setTime(value)}
                />
                <TimePicker
                    className=""
                    format="hh:mm aa"
                    showMeridiem
                    value={time}
                    container={document.body}
                    onChange={(value) => setTime(value)}
                />
                <SelectPicker
                    data={MATERIAS}
                    placeholder="Profesor"
                    className="w-[224]"
                />
                <SelectPicker
                    data={MATERIAS}
                    placeholder="Materia"
                    className="w-[224]"
                />
                <SelectPicker
                    data={MATERIAS}
                    placeholder="Tema"
                    className="w-[224]"
                />
                <SelectPicker
                    data={MATERIAS}
                    placeholder="Unidad"
                    className="w-[224]"
                />
            </form>
        </>
    );
}
