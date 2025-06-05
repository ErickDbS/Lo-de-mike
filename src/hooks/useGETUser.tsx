import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const getUser = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
        } else if (error.request) {
        } else {
        }
        throw error;
    }
};

export const useGetUser = (id: number | null | undefined) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUser(id as number),
        enabled: Boolean(id),
    });
};
