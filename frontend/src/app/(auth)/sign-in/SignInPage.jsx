"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const SignInPage = () => {
    const [formData, setFormData] = useState({
        password: "",
        email: "",
    });
    const passwordRef = useRef(null);
    const router = useRouter();
    const { setUser } = useUser();
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
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
                formData,
                { withCredentials: true }
            );
            if (res.data.success) {
                setUser(res.data.data);
                Cookies.set("authToken", res.data.token, { expires: 2 }); //cookies set by the server are not accessible in client side,nextjs app. Cookies set by backend is has different domain. Hence setting cookie in client side also.It helps to middleware to identify authenticated user.
                toast.success("Login Successfully");
                router.push("/home");
            }
        } catch (err) {
            toast.error(err.response.data.error);
        } finally {
            setSending(false);
        }
    };
    return (
        <div className="w-full h-screen bg-gray-800 flex  items-center justify-center sm:flex-row text-white">
            <div className="w-full  h-screen flex justify-center m-auto items-center flex-col sm:w-6/12">
                <h1 className="text-5xl font-sans my-10 font-bold">LOGIN</h1>

                <form
                    onSubmit={handleSend}
                    className="h-[55vh] w-[85vw] flex items-center justify-center sm:w-[50vh] gap-5 flex-col rounded-2xl border-purple-500 border bg-gray-950/30 backdrop-blur-none shadow-md shadow-purple-500">
                    <input
                        type="email"
                        autoFocus
                        placeholder="Enter email address"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }
                        onKeyDown={handleKeyDown} // Trigger focus move here
                        className=" bg-transparent border border-gray-500 px-4 w-[60vw] h-[5vh] sm:w-[19vw] rounded-md"></input>

                    <input
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        ref={passwordRef}
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        className="border border-gray-500 px-4 w-[60vw] h-[5vh] sm:w-[19vw] rounded-md"></input>

                    <button
                        type="submit"
                        disabled={sending}
                        className="border border-gray-500 text-gray-200 cursor-pointer 
        px-6 py-2 sm:px-8 sm:py-2.5 rounded-md 
        transition 
        hover:bg-gray-700 hover:text-white hover:border-purple-500 hover:scale-[1.02]
    ">
                        Login
                    </button>
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <span
                            onClick={() => router.push("/sign-up")}
                            className="text-purple-500 cursor-pointer hover:underline">
                            Sign Up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default SignInPage;
