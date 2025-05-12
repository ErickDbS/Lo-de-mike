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
                <div className="grid grid-cols-2 gap-2 w-3/10">
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
                </div>
                <div className="grid grid-cols-4 gap-2 w-full ml-2">
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                    />
                    <SelectPicker
                        data={MATERIAS}
                        placeholder=""
                        className="w-[224]"
                    />
                </div>
            </form>
        </>
    );
}
