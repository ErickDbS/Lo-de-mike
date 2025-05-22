import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AuthContexProvider from "./utils/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContexProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthContexProvider>
        </QueryClientProvider>
    );
}
