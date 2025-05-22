import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ApiResponse {
    subjects: any[];
    status: any;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

const getSubjects = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/subjects`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        throw error;
    }
};

export const useGETSubjects = () => {
    const query = useQuery({ queryKey: ["subjects"], queryFn: getSubjects });
    return query;
};
