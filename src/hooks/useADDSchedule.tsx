import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const useADDSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newData: any) => {
            const response = await axios.post(`${BASE_URL}/class`, newData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};
