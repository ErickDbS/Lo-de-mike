import React from "react";
import Select, { SingleValue, MultiValue } from "react-select";

interface ComboboxProps {
    data: any[];
    type?: "single" | "multi";
    placeHolder: string;
    value?: any;
    onChange?: (selected: SingleValue<any> | MultiValue<any>) => void;
}

const Combobox: React.FC<ComboboxProps> = ({
    data,
    type = "single",
    placeHolder,
    value,
    onChange,
}) => {
    return type === "multi" ? (
        <Select
            options={data}
            value={value}
            onChange={onChange}
            placeholder={placeHolder}
            isMulti
            closeMenuOnSelect={false}
        />
    ) : (
        <Select
            options={data}
            value={value}
            onChange={onChange}
            placeholder={placeHolder}
            isClearable
        />
    );
};

export default Combobox;
