"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/utils/UserData";
import { toast } from "react-toastify";
const NavBar = () => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const handleLogout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/signout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/sign-in");
        } catch (e) {
            toast.error("Logout failed");
            console.error("Logout failed:", e);
        }
    };

    return (
        <nav className="w-full h-16 flex items-center fixed top-1 justify-between px-6 bg-gray-900 text-white">
            <h1 className="font-bold text-xl">Interview Portal</h1>
            <div className="flex items-center gap-4">
                {user && <span>Hello, {user.name}</span>}
                {user && (
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 rounded bg-red-500 cursor-pointer text-sm">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
