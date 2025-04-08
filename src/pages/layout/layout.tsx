import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="flex-1 p-4 bg-[#181a1b]">
                <Outlet />
            </main>
        </>
    );
}
