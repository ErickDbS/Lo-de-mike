import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
    canActivate = true,
    redirectPath = "/",
}) {
    if (!canActivate) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
}
