import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Eye, EyeOff, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../utils/authContext";

interface Group {
    group_id: number;
    name: string;
}

interface RegisterResponse {
    message: string;
    user: { id: number; username: string };
}

export default function Register() {
    const apiUrl = import.meta.env.VITE_API_URL

    const authContext = useContext(AuthContext) as any;
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const navigate = useNavigate();

    // Obtener grupos
    const {
        data: groupsResponse,
    } = useFetch<{ groups: Group[] }>(`${apiUrl}/groups`, {
        method: "GET",
    });

    const {
        register,
        getValues,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm();

    const {
        data,
        error: fetchError,
        doFetch,
        loading,
    } = useFetch<RegisterResponse>(null, null);

    useEffect(() => {
        if (data) {
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: data.message,
            }).then(() => {
                authContext.setStorage({
                    username: getValues("username"),
                    name: getValues("name"),
                    lastname: getValues("lastname"),
                    role: getValues("role_id"),
                });
                navigate("/home");
            });
        }
    }, [data, navigate]);

    useEffect(() => {
        if (fetchError) {
            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: fetchError.errors?.username || "Error al crear cuenta.",
            });
        }
    }, [fetchError]);

    const handleConfirmPassword = (value: string) => {
        setConfirmPassword(value);
        validatePasswords(getValues("password"), value);
    };

    const validatePasswords = (password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
        } else {
            setError("");
        }
    };

    const onSubmit = (formData: any) => {
        if (selectedRole === "1") {
            formData.group_id = selectedGroup;
    
            const selectedGroupObject = groupsResponse?.groups.find(
                (group) => group.group_id.toString() === selectedGroup
            );
    
            if (selectedGroupObject) {
                localStorage.setItem("group_name", selectedGroupObject.name);
            }
        }
    
        doFetch(`${apiUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    };
    

    return (
        <>
            <nav className="h-16 w-full bg-blue-800 flex items-center px-20">
                <CalendarDays className="text-white h-10 w-10" />
                <h1 className="text-white text-2xl ml-2">Mike's Schedules</h1>
            </nav>

            <div className="min-h-[calc(100vh-4rem)] flex justify-center items-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 border-4 w-96 p-6 bg-[#1e2022] shadow-md rounded-md border-[1px] border-gray-400"
                >
                    <h2 className="text-4xl text-blue-400 text-center mb-2">
                        Crear Cuenta
                    </h2>

                    <div className="flex">
                        <div className="flex flex-col">
                            <input
                                type="text"
                                className="w-38 p-2 mr-2 border rounded-md placeholder:text-gray-400 text-white"
                                placeholder="Nombre"
                                {...register("name", { required: true })}
                            />
                            {errors.name && (
                                <span className="text-red-500">Campo requerido.</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                className="w-38 p-2 ml-2 border rounded-md placeholder:text-gray-400 text-white"
                                placeholder="Apellido Paterno"
                                {...register("lastname", { required: true })}
                            />
                            {errors.lastname && (
                                <span className="ml-2 text-red-500">Campo requerido.</span>
                            )}
                        </div>
                    </div>

                    <input
                        type="text"
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 text-white"
                        placeholder="Nombre de usuario"
                        {...register("username", { required: true })}
                    />
                    {errors.username && (
                        <span className="text-red-500">Nombre de usuario requerido.</span>
                    )}

                    <div className="relative w-80">
                        <label className="font-bold text-white">Contraseña</label>
                        <input
                            className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10 text-white"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            {...register("password", { required: true, minLength: 8 })}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-white hover:text-gray-200"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password?.type === "required" && (
                        <span className="text-red-500">Ingrese una contraseña.</span>
                    )}
                    {errors.password?.type === "minLength" && (
                        <span className="text-red-500">Mínimo 8 caracteres.</span>
                    )}

                    <div className="relative w-80">
                        <label className="font-bold text-white">Confirmar Contraseña</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded-md placeholder:text-gray-400 pr-10 text-white"
                            required
                            placeholder="******"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-white hover:text-gray-200"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {error && <span className="text-red-500">{error}</span>}

                    {/* Tipo de usuario */}
                    <select
                        defaultValue=""
                        className="border-1 border-white text-white rounded-md h-11 mt-2 px-2 cursor-pointer w-80"
                        {...register("role_id", { required: true })}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            Selecciona un tipo de usuario
                        </option>
                        <option value="1">Jefe de Grupo</option>
                        <option value="2">Docente</option>
                        <option value="3">Checador</option>
                        <option value="4">Jef@ de Carrera</option>
                    </select>

                    {/* Selector de grupo visible solo si es jefe de grupo */}
                    {selectedRole === "1" && (
                        <select
                            className="border-1 border-white text-white rounded-md h-11 mt-2 px-2 cursor-pointer w-80"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="" disabled>
                                Selecciona tu grupo
                            </option>
                            {groupsResponse?.groups.map((group) => (
                                <option key={group.group_id} value={group.group_id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        className={`mt-5 py-2 rounded-md transition-colors ${
                            error ||
                            !watch("password") ||
                            !confirmPassword ||
                            loading ||
                            !isValid
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-blue-800 text-white hover:bg-blue-700 cursor-pointer"
                        }`}
                        disabled={!!error}
                    >
                        {loading ? "Cargando..." : "Crear Cuenta"}
                    </button>

                    <label className="text-white text-center">O</label>
                    <div className="text-center">
                        <label className="text-white">
                            Ya tienes una cuenta?{" "}
                            <Link to={"/login"} className="text-blue-400 hover:text-blue-700">
                                Inicia Sesión
                            </Link>
                        </label>
                    </div>
                </form>
            </div>
        </>
    );
}
