"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
import { MenuIcon, UserCircle2Icon } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
const NavBar = () => {
    const router = useRouter();
    const { user, setUser, setResume } = useUser();
    const [showLogout, setShowLogout] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const handleLogout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/signout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            setResume(null);
            toast.success("Sign out successfully");
            Cookies.remove("authToken");
            router.push("/sign-in");
        } catch (e) {
            toast.error("Logout failed");
        }
    };

    return (
        <nav
            className="w-full h-16 flex z-50 items-center sticky top-0 justify-between 
                          px-4 sm:px-6 md:px-8 bg-white dark:bg-black shadow-lg shadow-gray-300 dark:shadow-gray-800">
            <Link
                className="font-bold text-base sm:text-xl text-purple-400 tracking-wide"
                href={"/home"}>
                <Image src={"/logo.png"} alt="Logo" width={120} height={40} />
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
                        <Link className="hidden md:flex" href={"/resume"}>
                            Resume
                        </Link>
                        <Link
                            className="hidden md:flex"
                            href={"/resume/ats-report"}>
                            ATS Resume Parser
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
                            <div className="flex flex-col fixed right-10 border-2 bg-white dark:bg-black border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <span className="text-xs sm:text-base ">
                                    Hello, {user.name}
                                </span>
                                <ThemeToggle />
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    bg-red-600 font-medium text-xs sm:text-sm 
                                    transition
                                    hover:bg-red-700 hover:shadow-md">
                                    Logout
                                </button>
                            </div>
                        )}
                        {!showLogout && showMenu && (
                            <div className="flex flex-col md:hidden fixed right-20 bg-white dark:bg-black border-2 border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                 font-medium text-xs sm:text-sm 
                                    transition
                            hover:shadow-md"
                                    href={"/dashboard"}>
                                    Dashboard
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                 font-medium text-xs sm:text-sm 
                                    transition
                                    hover:hover:shadow-md"
                                    href={"/feedback"}>
                                    Feedbacks
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                 font-medium text-xs sm:text-sm 
                                    transition
                                    hover:hover:shadow-md"
                                    href={"/resume"}>
                                    Resume
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                 font-medium text-xs sm:text-sm 
                                    transition
                                    hover:shadow-md"
                                    href={"/resume/ats-report"}>
                                    ATS Resume Parser
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
