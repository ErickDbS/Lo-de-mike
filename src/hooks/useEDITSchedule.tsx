import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const useEDITSchedule = (group_Id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newData: any) => {
            const response = await axios.put(
                `${BASE_URL}/class/${group_Id}`,
                newData
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
};
