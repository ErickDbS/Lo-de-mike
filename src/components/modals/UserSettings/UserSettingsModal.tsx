import { Modal } from "rsuite";
import "rsuite/Modal/styles/index.css";
import "rsuite/Animation/styles/index.css";
import { Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUser } from "../../../hooks/useGETUser";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useEDITUser } from "../../../hooks/useEDITUser";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onExited: () => void;
}

export default function UserSettingsModal({
    isOpen,
    onClose,
    onExited,
}: Props) {
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const storedUser = localStorage.getItem("UserData");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.id;

    const data = useGetUser(userId);
    const queryClient = useQueryClient();

    const editUser = useEDITUser(userId);

    useEffect(() => {
        if (data.data) {
            const userData = data.data.user;
            setNombre(userData.name || "");
            setApellidoPaterno(userData.lastname || "");
            setNombreUsuario(userData.username || "");
        }
    }, [data.data]);

    useEffect(() => {
        if (!nuevaContrasena && !confirmarContrasena) {
            setPasswordError(null);
            return;
        }
        if (nuevaContrasena !== confirmarContrasena) {
            setPasswordError("Las contraseñas no coinciden");
        } else {
            setPasswordError(null);
        }
    }, [nuevaContrasena, confirmarContrasena]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            (nuevaContrasena || confirmarContrasena) &&
            nuevaContrasena !== confirmarContrasena
        ) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }

        const validPayloads = {
            name: nombre,
            lastname: apellidoPaterno,
            username: nombreUsuario,
            ...(nuevaContrasena ? { password: nuevaContrasena } : {}), // ✅ 3. Payload
        };

        editUser.mutate(validPayloads, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] });
                Swal.fire({
                    icon: "success",
                    title: "¡Listo!",
                    text: "Usuario actualizado exitosamente.",
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    position: "top-end",
                });
                onClose();
            },
            onError: (error: any) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text:
                        error?.response?.data?.errors ||
                        error?.message ||
                        "Por favor, intenta de nuevo.",
                });
            },
        });
    };

    return (
        <Modal
            backdrop="static"
            open={isOpen}
            onExited={onExited}
            onClose={onClose}
            size="90%"
            className="animate-fade-down animate-ease-in-out text-white max-w-md mx-auto mt-8 p-2 rounded-md shadow-5xl"
        >
            <Modal.Header onClose={onClose} closeButton={false}>
                <div className="flex w-full justify-between items-center px-2">
                    <h1 className="text-2xl font-bold">
                        Configuraciones de usuario
                    </h1>
                    <button
                        className="hover:text-red-500 hover:scale-135 cursor-pointer transition"
                        title="Salir"
                        onClick={() => onClose()}
                    >
                        <X />
                    </button>
                </div>
            </Modal.Header>

            <Modal.Body>
                <div className="p-2">
                    <p className="text-white mb-4">
                        Al editar sus datos pulse el botón guardar para que los
                        cambios surtan efecto.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <label
                                htmlFor="nombre"
                                className="block text-gray-200 mb-1"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu nombre"
                                required
                            />
                        </div>

                        {/* Apellido Paterno */}
                        <div>
                            <label
                                htmlFor="apellidoPaterno"
                                className="block text-gray-200 mb-1"
                            >
                                Apellido Paterno
                            </label>
                            <input
                                type="text"
                                id="apellidoPaterno"
                                value={apellidoPaterno}
                                onChange={(e) =>
                                    setApellidoPaterno(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu apellido paterno"
                                required
                            />
                        </div>

                        {/* Nombre de Usuario */}
                        <div>
                            <label
                                htmlFor="nombreUsuario"
                                className="block text-gray-200 mb-1"
                            >
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                id="nombreUsuario"
                                value={nombreUsuario}
                                onChange={(e) =>
                                    setNombreUsuario(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu nombre de usuario"
                                required
                            />
                        </div>

                        {/* Sección para cambiar contraseña (ahora opcional) */}
                        <h1 className="text-white text-lg w-full text-center font-bold">
                            Cambiar contraseña (opcional)
                        </h1>

                        {/* Nueva Contraseña */}
                        <div className="relative">
                            <label
                                htmlFor="nuevaContrasena"
                                className="block text-gray-200 mb-1"
                            >
                                Nueva Contraseña
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="nuevaContrasena"
                                value={nuevaContrasena}
                                onChange={(e) =>
                                    setNuevaContrasena(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-white hover:text-gray-200 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Confirmar Nueva Contraseña */}
                        <div className="relative">
                            <label
                                htmlFor="confirmarContrasena"
                                className="block text-gray-200 mb-1"
                            >
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type={showPassword2 ? "text" : "password"}
                                id="confirmarContrasena"
                                value={confirmarContrasena}
                                onChange={(e) =>
                                    setConfirmarContrasena(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-white hover:text-gray-200 cursor-pointer"
                                onClick={() => setShowPassword2(!showPassword2)}
                            >
                                {showPassword2 ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Mensaje de error si las contraseñas no coinciden */}
                        {passwordError && (
                            <p className="text-red-400 text-sm">
                                {passwordError}
                            </p>
                        )}

                        {/* Botón de Guardar */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md  cursor-pointer hover:scale-102 transition ease-in-out"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
