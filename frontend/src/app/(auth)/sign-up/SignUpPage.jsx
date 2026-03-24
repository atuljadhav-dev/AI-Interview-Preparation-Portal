"use client";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Link from "next/link";
import api from "@/utils/api";
const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [sending, setSending] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const router = useRouter();
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const { refreshUser } = useUser();
    const handleKeydown = (e, name) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents the form from submitting early
            name.current.focus();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (sending) return;
        try {
            setSending(true);
            const res = await api.post("/auth/signup", formData);
            toast.success("Registration Successfully");
            Cookies.set("authToken", res.data.token, { expires: 2 });
            refreshUser(); //to refetch the user data in the useUser hook
            router.push("/home");
        } catch (err) {
            toast.error(err.response.data.error);
        } finally {
            setSending(false);
        }
    };
    return (
        <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 transition">
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 w-[90vw] sm:w-[420px] border border-white/30 dark:border-gray-700 transition">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            autoFocus
                            onChange={handleFormChange}
                            value={formData.name}
                            onKeyDown={(e) => handleKeydown(e, emailRef)}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            ref={emailRef}
                            onChange={handleFormChange}
                            onKeyDown={(e) => handleKeydown(e, passwordRef)}
                            value={formData.email}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1 relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type={showPass ? "text" : "password"}
                            name="password"
                            ref={passwordRef}
                            onChange={handleFormChange}
                            onKeyDown={(e) =>
                                handleKeydown(e, confirmPasswordRef)
                            }
                            value={formData.password}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
                        />
                        <span
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-600 dark:text-gray-300">
                            {showPass ? "Hide" : "Show"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPass ? "text" : "password"}
                            name="confirmPassword"
                            ref={confirmPasswordRef}
                            onChange={handleFormChange}
                            value={formData.confirmPassword}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
                        />
                        <span
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-[38px] cursor-pointer text-gray-600 dark:text-gray-300">
                            {showConfirmPass ? "Hide" : "Show"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.03] hover:shadow-lg transition duration-300 disabled:opacity-50">
                        {sending ? "Creating..." : "Register"}
                    </button>

                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default SignUpPage;
