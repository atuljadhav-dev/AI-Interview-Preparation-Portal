"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import Link from "next/link";
import { MenuIcon, UserCircle2Icon, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import dark from "/public/Black.png";
import light from "/public/White.png";
import { useTheme } from "next-themes";
import api from "@/utils/api";
const NavBar = () => {
    const router = useRouter();
    const { user, signOut } = useUser();
    const [showLogout, setShowLogout] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { theme } = useTheme();
    const handleLogout = async () => {
        try {
            await api.post("/auth/signout", {});
            toast.success("Sign out successfully");
            signOut(); //clear user data from context
            router.push("/sign-in");
        } catch (e) {
            toast.error("Logout failed");
        }
    };

    return (
        <nav className="w-full h-16 flex z-50 items-center sticky top-0 justify-between px-4 sm:px-6 md:px-8 bg-white dark:bg-black">
            <Link
                className="font-bold text-base bg-red-500 sm:text-xl text-purple-400 tracking-wide"
                href={"/home"}>
                <Image
                    src={theme == "light" ? dark : light}
                    alt="Logo"
                    width={50}
                    height={10}
                />
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
                            ATS Report
                        </Link>
                        <MenuIcon
                            className={`md:hidden cursor-pointer ${
                                showMenu ? "hidden" : ""
                            }`}
                            onClick={() => {
                                setShowLogout(false);
                                setShowMenu(true);
                            }}
                        />
                        <X
                            className={`md:hidden cursor-pointer ${
                                showMenu ? "" : "hidden"
                            }`}
                            onClick={() => {
                                setShowMenu(false);
                                setShowLogout(false);
                            }}
                        />
                        <UserCircle2Icon
                            className="cursor-pointer"
                            onClick={() => {
                                setShowMenu(false);
                                setShowLogout(!showLogout);
                            }}
                        />
                        {!showLogout && showMenu && (
                            <div className="flex flex-col md:hidden fixed right-18 bg-white dark:bg-black border-2 border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    font-medium text-xs sm:text-sm 
                                    transition
                            hover:shadow-md dark:shadow-white"
                                    href={"/dashboard"}>
                                    Dashboard
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    font-medium text-xs sm:text-sm 
                                    transition
                                    hover:shadow-md dark:shadow-white"
                                    href={"/feedback"}>
                                    Feedbacks
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    font-medium text-xs sm:text-sm 
                                    transition
                                    hover:shadow-md dark:shadow-white"
                                    href={"/resume"}>
                                    Resume
                                </Link>
                                <Link
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer
                                    font-medium text-xs sm:text-sm 
                                    transition
                                    hover:shadow-md dark:shadow-white"
                                    href={"/resume/ats-report"}>
                                    ATS Report
                                </Link>
                            </div>
                        )}
                        {!showMenu && showLogout && (
                            <div className="flex flex-col fixed right-10 border-2 bg-white dark:bg-black border-gray-400 p-3 rounded-xl gap-2 top-10">
                                <span className="text-xs sm:text-base ">
                                    Hello, {user.name}
                                </span>
                                <ThemeToggle />
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer bg-red-600 font-medium text-xs sm:text-sm text-white transition hover:bg-red-700 hover:shadow-md">
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
