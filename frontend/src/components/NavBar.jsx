"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
import { MenuIcon, UserCircle2Icon } from "lucide-react";
import { useState } from "react";
const NavBar = () => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [showLogout, setShowLogout] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
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
            <Link
                className="font-bold text-base sm:text-xl text-purple-400 tracking-wide"
                href={"/home"}>
                PlacementReady
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
                {user && (
                    <>
                        <Link className="hidden md:flex" href={"/dashboard"}>
                            Dashboard
                        </Link>
                        <Link className="hidden md:flex" href={"/feedback"}>
                            Feedbacks
                        </Link>
                        <Link className="hidden md:flex" href={"/userdata"}>
                            Profile
                        </Link>
                        <MenuIcon
                            className="md:hidden cursor-pointer"
                            onClick={() => {
                                setShowLogout(false);
                                setShowMenu(!showMenu);
                            }}
                        />

                        <UserCircle2Icon
                        className="cursor-pointer"
                            onClick={() => {
                                setShowMenu(false);
                                setShowLogout(!showLogout);
                            }}
                        />{" "}
                        {!showMenu && showLogout && (
                            <div className="flex flex-col fixed right-10 bg-gray-800 border-2 border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <span className="text-xs sm:text-base text-gray-300">
                                    Hello, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    bg-red-600 text-white font-medium text-xs sm:text-sm 
                                    transition
                                    hover:bg-red-700 hover:shadow-md">
                                    Logout
                                </button>
                            </div>
                        )}
                        { !showLogout && showMenu && (
                            <div className="flex flex-col md:hidden fixed right-20 bg-gray-800 border-2 border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    bg-gray-700 text-white font-medium text-xs sm:text-sm 
                                    transition
                                    hover:bg-gray-600 hover:shadow-md"
                                    href={"/dashboard"}>
                                    Dashboard
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    bg-gray-700 text-white font-medium text-xs sm:text-sm 
                                    transition
                                    hover:bg-gray-600 hover:shadow-md"
                                    href={"/feedback"}>
                                    Feedbacks
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    bg-gray-700 text-white font-medium text-xs sm:text-sm 
                                    transition
                                    hover:bg-gray-600 hover:shadow-md"
                                    href={"/userdata"}>
                                    Profile
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
