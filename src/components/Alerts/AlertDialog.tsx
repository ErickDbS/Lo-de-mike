import { Button, Modal, Animation } from "rsuite";
import "rsuite/Modal/styles/index.css";
import "rsuite/Animation/styles/index.css";

import {
    BadgeCheck,
    CircleX,
    OctagonAlert,
    BadgeInfo,
    CircleHelp,
} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: any;
    icon: "success" | "error" | "warning" | "info" | "question" | null;
    title: string;
    message: string;
    textButton: string;
    colorButton:
        | "red"
        | "orange"
        | "yellow"
        | "green"
        | "cyan"
        | "blue"
        | "violet";
}

export default function AlertDialog({
    isOpen,
    onClose,
    icon,
    title,
    message,
    textButton,
    colorButton,
}: Props) {
    const renderIcon = (icon: any) => {
        switch (icon) {
            case "success":
                return <BadgeCheck className="text-green-500 w-6 h-6 mb-2" />;
            case "error":
                return <CircleX className="text-red-500 w-20 h-20 mb-2" />;
            case "warning":
                return (
                    <OctagonAlert className="text-yellow-500 w-6 h-6 mb-2" />
                );
            case "info":
                return <BadgeInfo className="text-blue-500 w-6 h-6 mb-2" />;
            case "question":
                return <CircleHelp className="text-purple-500 w-6 h-6 mb-2" />;
            default:
                return null;
        }
    };

    return (
        <Animation.Slide in={isOpen} placement="top">
            <Modal
                backdrop="static"
                role="alertdialog"
                open={isOpen}
                onClose={onClose}
                size="xs"
                className="animate-fade-down animate-ease-in-out "
            >
                <Modal.Body className="flex flex-col items-center gap-2">
                    {renderIcon(icon)}
                    <h1 className="text-lg font-semibold">{title}</h1>
                    <p className="text-center">{message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onClose}
                        className={` text-white`}
                        appearance="primary"
                        color={colorButton}
                    >
                        {textButton}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Animation.Slide>
    );
}
