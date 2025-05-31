import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const getGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/groups/filter`);
        return response.data;
    } catch (error: any) {
        // if (error.response) {
        //     console.log(error.response.data);
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        // } else if (error.request) {
        //     console.log(error.request);
        // } else {
        //     console.log("Error", error.message);
        // }
        throw error;
    }
};

export const useGETGroupsFilters = () => {
    const query = useQuery({ queryKey: ["groupsFilter"], queryFn: getGroups });
    return query;
};
