import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AuthContexProvider from "./utils/authContext";

export default function App() {
    return (
        <AuthContexProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthContexProvider>
    );
}
