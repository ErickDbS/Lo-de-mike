import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const useDELETESchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (group_ID: string) => {
            const response = await axios.delete(
                `${BASE_URL}/class/${group_ID}`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
        onError: (error) => {
            // console.error("Error al eliminar horario:", error);
        },
    });
};
