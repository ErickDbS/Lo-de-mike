import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CalendarDays } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { AuthContext } from "../../utils/authContext";

export default function Login() {
    const authContext = useContext(AuthContext) as any;
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { data, error: fetchError, doFetch, loading } = useFetch(null, null);
    const BASE_URL = import.meta.env.VITE_API_URL as string;
    useEffect(() => {
        if (data) {
            authContext.setStorage({
                username: data.user.username,
                name: data.user.name,
                lastname: data.user.lastname,
                role: data.user.role_id,
            });
            navigate("/home");
        }
    }, [data, navigate]);

    useEffect(() => {
        if (fetchError) {
            Swal.fire({
                icon: "error",
                title: "Error al Iniciar Sesión",
                text: fetchError.message,
            });
        }
    }, [fetchError]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: object) => {
        doFetch(`${BASE_URL}/login`, {
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
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-4 border-4 w-96 p-6 bg-[#1e2022] shadow-md rounded-md border-[1px] border-gray-400"
                >
                    <label className="grid text-4xl place-items-center text-blue-400">
                        Iniciar Sesión
                    </label>
                    <label className="text-xl font-bold text-white">
                        Usuario
                    </label>
                    <input
                        type="text"
                        className="w-80 p-2 border rounded-md placeholder:text-gray-400 placeholder:italic text-white"
                        {...register("username", {
                            required: true,
                        })}
                    />
                    {errors.username?.type === "required" && (
                        <span className="text-red-500">Campo requerido.</span>
                    )}
                    <label className="text-xl font-bold text-white">
                        Contraseña
                    </label>
                    <div className="relative w-80">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-2 border rounded-md placeholder:text-gray-200 pr-10 text-white"
                            placeholder="******"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-white hover:text-gray-200 cursor-pointer"
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
                        <span className="text-red-500">Campo requerido.</span>
                    )}
                    <button
                        className={`text-white rounded-md bg-blue-800 mt-5 py-2
                        ${
                            loading
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-blue-800 text-white hover:bg-blue-700 cursor-pointer"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                    <label className="grid place-items-center text-white">
                        O
                    </label>
                    <Link
                        to={"/register"}
                        className="text-lg grid place-items-center text-blue-400 hover:text-blue-700"
                    >
                        Crea una cuenta
                    </Link>
                </form>
            </div>
        </>
    );
}
