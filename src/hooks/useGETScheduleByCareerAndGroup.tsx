import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ApiResponse {
    classes: any[];
    status: any;
}

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const useGETScheduleByCaarerAndGroup = (
    career_Id: string,
    group_Id: string
) => {
    const getSchedule = async (): Promise<ApiResponse> => {
        try {
            const response = await axios.get(
                `${BASE_URL}/class/career/${career_Id}/${group_Id}`
            );
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

    const query = useQuery({
        queryKey: ["scheduleByCareerAndGroup"],
        queryFn: getSchedule,
    });
    return query;
};
