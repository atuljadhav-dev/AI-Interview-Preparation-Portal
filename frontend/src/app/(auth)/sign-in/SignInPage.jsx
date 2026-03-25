"use client";
import { useUser } from "@/hooks/useUser";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import api from "@/utils/api";
const SignInPage = () => {
    const [formData, setFormData] = useState({
        password: "",
        email: "",
    });
    const [showPass, setShowPass] = useState(false);
    const params = useSearchParams();
    useEffect(() => {
        if (params.get("notify")) {
            toast.info("Please sign in to access this page.");
        }
    }, [params]);
    const passwordRef = useRef(null);
    const router = useRouter();
    const { refreshUser } = useUser();
    const [sending, setSending] = useState(false);
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents the form from submitting early
            passwordRef.current.focus();
        }
    };
    const handleSend = async (e) => {
        e.preventDefault();
        if (sending) return;
        try {
            setSending(true);
            const res = await api.post("/auth/signin", formData);
            if (res.data.success) {
                Cookies.set("authToken", res.data.token, { expires: 2 }); //cookies set by the server are not accessible in client side,nextjs app. Hence setting cookie in client side also.It helps to middleware to identify authenticated user.Server side cookies are set http only so that cookies will not be accessible in the middleware.
                toast.success("Sign In Successfully");
                refreshUser(); //to refetch the user data in the useUser hook
                if (params.get("redirect")) {
                    router.push(params.get("redirect"));
                } else {
                    router.push("/home");
                }
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.error);
        } finally {
            setSending(false);
        }
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center 
    px-4 sm:px-6 lg:px-8 py-6 sm:py-10 
    bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 
    dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 transition">
            <div className="w-full max-w-md mx-auto">
                <div
                    className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
        shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/30 dark:border-gray-700">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
                        Welcome Back
                    </h1>

                    <form onSubmit={handleSend} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                autoFocus
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                onKeyDown={handleKeyDown}
                                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:ring-2 focus:ring-purple-400 outline-none transition"
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
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:ring-2 focus:ring-purple-400 outline-none transition "></input>{" "}
                            <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-10 text-sm cursor-pointer text-purple-600 dark:text-purple-400">
                                {showPass ? "Hide" : "Show"}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold 
            hover:scale-[1.03] hover:shadow-lg transition duration-300 
            ${sending ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}>
                            {sending ? "Signing in..." : "Sign In"}
                        </button>

                        {/* Footer */}
                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                            Don't have an account?{" "}
                            <span
                                onClick={() => router.push("/sign-up")}
                                className="text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline">
                                Sign Up
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default SignInPage;
