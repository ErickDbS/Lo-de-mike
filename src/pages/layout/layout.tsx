import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="flex-1 px-20 py-10 bg-[#181a1b]">
                <Outlet />
            </main>
        </>
    );
}
