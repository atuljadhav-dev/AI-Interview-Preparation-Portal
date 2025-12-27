"use client";

import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
const signup = () => {
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
    const router = useRouter();
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const { setUser } = useUser();
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
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
                formData,
                { withCredentials: true }
            );
            toast.success("Registration Successfully");
            Cookies.set("authToken", res.data.token, { expires: 2 });
            setUser(res.data.data);
            router.push("/home");
        } catch (err) {
            toast.error(err.response.data.error);
        } finally {
            setSending(false);
        }
    };
    return (
        <div className="w-full h-screen bg-gray-800 flex justify-center items-center flex-col sm:flex-row text-white">
            <div className="w-full h-screen flex  items-center  flex-col sm:w-6/12">
                <h1 className="text-5xl font-sans my-10 font-bold">SIGN-UP</h1>
                <form
                    onSubmit={handleSubmit}
                    className="h-[65vh] w-[85vw] sm:w-[50vh] p-5 flex items-center justify-evenly flex-col rounded-2xl border-purple-500 border bg-gray-950/30 backdrop-blur-none shadow-md shadow-purple-500">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        autoFocus
                        onChange={handleFormChange}
                        value={formData.name}
                        onKeyDown={(e) => {
                            handleKeydown(e, emailRef);
                        }}
                        className=" border border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleFormChange}
                        name="email"
                        ref={emailRef}
                        onKeyDown={(e) => {
                            handleKeydown(e, passwordRef);
                        }}
                        value={formData.email}
                        className="border border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    <input
                        type="password"
                        placeholder="Create password"
                        onChange={handleFormChange}
                        name="password"
                        ref={passwordRef}
                        onKeyDown={(e) => {
                            handleKeydown(e, confirmPasswordRef);
                        }}
                        value={formData.password}
                        className="border border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        ref={confirmPasswordRef}
                        onChange={handleFormChange}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        className="border border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>

                    <button
                        type="submit"
                        disabled={sending}
                        className="border border-gray-500 text-gray-200 cursor-pointer 
        px-6 py-2 sm:px-8 sm:py-2.5 rounded-md 
        transition
        hover:bg-gray-700 hover:text-white hover:border-purple-500 hover:scale-[1.02]
    ">
                        Register
                    </button>
                    <p className="text-gray-500">
                        Alredy have an account?{" "}
                        <a href="/sign-in" className="text-purple-500">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default signup;
