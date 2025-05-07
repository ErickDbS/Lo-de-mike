import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "react-hook-form";

interface RegisterResponse {
    message: string;
    user: { id: number; username: string };
}

export default function Register() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    // **Estados para disparar el hook**
    const [endpoint, setEndpoint] = useState<string | null>(null);
    const [options, setOptions] = useState<RequestInit | null>(null);

    // Hook para uso de formulario
    const {
        register,
        getValues,
        watch,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm();

    // Hook para la peticion http
    const { data, error: fetchError } = useFetch<RegisterResponse>(
        endpoint,
        options
    );

    useEffect(() => {
        if (data) {
            console.log(data);
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: data.message,
            }).then(() => {
                localStorage.setItem(
                    "UserData",
                    JSON.stringify({
                        username: getValues("username"),
                        role: getValues("role_id"),
                    })
                );
            });

            navigate("/home");
        }
    }, [data, navigate]);

    useEffect(() => {
        if (fetchError) {
            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: fetchError.errors.username,
            });
        }
    }, [fetchError]);

    const handleConfirmPassword = (value: string) => {
        setConfirmPassword(value);
        validatePasswords(getValues("password"), value);
    };

    const validatePasswords = (password: string, confirmPassword: string) => {
        if (password != confirmPassword) {
            setError("Las contraseñas no coinciden");
        } else {
            setError("");
        }
    };

    const onSubmit = (data: object) => {
        setEndpoint("https://schedulechecker.up.railway.app/api/users");
        setOptions({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    };

    return (
        <>
            <nav className="h-16 w-full bg-blue-800 flex flex-row justify-left items-center px-20">
                <CalendarDays className="text-white h-10 w-10" />
                <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
            </nav>
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 border-4 w-96 p-6 bg-[#1e2022] shadow-md rounded-md border-[1px] border-gray-400"
                >
                    <h2 className="grid text-4xl place-items-center text-blue-400 mb-2">
                        Crear Cuenta
                    </h2>
                    {/* Campos de Nombre y Apellido */}
                    <div className="flex">
                        <div className="flex flex-col">
                            <input
                                type="text"
                                className="w-38 p-2 mr-2 border rounded-md placeholder:text-gray-400 placeholder:italic text-white"
                                placeholder="Nombre"
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            {errors.name?.type === "required" && (
                                <span className="text-red-500">
                                    Campo requerido.
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                className="w-38 p-2 ml-2 border rounded-md placeholder:text-gray-400 placeholder:italic text-white"
                                placeholder="Apellido Paterno"
                                {...register("lastname", {
                                    required: true,
                                })}
                            />
                            {errors.lastname?.type === "required" && (
                                <span className="ml-2 text-red-500">
                                    Campo requerido.
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Campo Nombre de Usuario */}
                    <input
                        type="text"
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic text-white"
                        placeholder="Nombre de usuario"
                        {...register("username", {
                            required: true,
                        })}
                    />
                    {errors.username?.type === "required" && (
                        <span className="text-red-500">
                            Nombre de usuario requerido.
                        </span>
                    )}

                    {/* Campo de contraseña con botón para mostrar/ocultar */}
                    <div className="relative w-80">
                        <label className="font-bold text-white">
                            Contraseña
                        </label>
                        <input
                            className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10 text-white"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                            })}
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
                    {errors.password?.type === "required" && (
                        <span className="text-red-500">
                            Ingrese una contraseña.
                        </span>
                    )}
                    {errors.password?.type === "minLength" && (
                        <span className="text-red-500">
                            La contraseña debe tener un mínimo de 8 caracteres.
                        </span>
                    )}

                    {/* Campo de confirmación de contraseña con botón para mostrar/ocultar */}
                    <div className="relative w-80">
                        <label
                            htmlFor="password"
                            className=" font-bold text-white"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) =>
                                handleConfirmPassword(e.target.value)
                            }
                            className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10 text-white"
                            required
                            placeholder="******"
                            name="password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-white hover:text-gray-200 cursor-pointer"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    {error && <span className="text-red-500">{error}</span>}

                    {/* Campo para el tipo de usuario */}
                    <select
                        defaultValue=""
                        className="border-1 border-white text-white rounded-md h-11 mt-2 px-2 cursor-pointer w-80"
                        {...register("role_id", {
                            required: true,
                        })}
                    >
                        <option value="" disabled hidden>
                            Selecciona un tipo de usuario
                        </option>
                        <option value="1">Jefe de Grupo</option>
                        <option value="2">Docente</option>
                        <option value="3">Checador</option>
                        <option value="4">Jef@ de Carrera</option>
                    </select>
                    <button
                        className={`mt-5 py-2 rounded-md transition-colors  ${
                            error ||
                            !watch("password") ||
                            !confirmPassword ||
                            !isValid
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-blue-800 text-white hover:bg-blue-700 cursor-pointer"
                        }`}
                        disabled={!!error}
                    >
                        Crear Cuenta
                    </button>
                    <label className="grid place-items-center text-white">
                        O
                    </label>
                    <div className="grid place-items-center">
                        <label className="text-white">
                            Ya tienes una cuenta?{" "}
                            <Link
                                to={"/login"}
                                className="text-blue-400 hover:text-blue-700"
                            >
                                {" "}
                                Inicia Sesion
                            </Link>
                        </label>
                    </div>
                </form>
            </div>
        </>
    );
}
