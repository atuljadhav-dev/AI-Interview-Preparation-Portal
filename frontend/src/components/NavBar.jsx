"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
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
            Cookies.remove("authToken");
            router.push("/sign-in");
        } catch (e) {
            toast.error("Logout failed");
        }
    };

    return (
        <nav
            className="w-full h-16 flex z-50 items-center sticky top-0 justify-between 
                          px-4 sm:px-6 md:px-8 bg-gray-900 text-white shadow-lg">
            <h1 className="font-bold text-base sm:text-xl text-purple-400 tracking-wide">
                PlacementReady
            </h1>
            <div className="flex items-center gap-3 sm:gap-4">
                {user && (
                    <span className="text-xs sm:text-base text-gray-300">
                        Hello, {user.name}
                    </span>
                )}
                {user && (
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg 
                                bg-red-600 text-white font-medium text-xs sm:text-sm 
                                transition
                                hover:bg-red-700 hover:shadow-md">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
