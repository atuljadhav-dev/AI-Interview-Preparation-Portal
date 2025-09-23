"use client";

import { useUser } from "@/utils/UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });
    const router = useRouter();
    const [error, setError] = useState("");
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const { setUser } = useUser();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
                formData,
                { withCredentials: true }
            );

            setUser(res.data.data);
            router.push("/home");
        } catch (err) {
            console.log(err.response.data.error);
            setError(err.response.data.error);
        }
    };
    return (
        <div className="w-full h-screen bg-gradient-to-r from-gray-900 to-black-700 flex justify-center items-center flex-col sm:flex-row  ">
            <div className="w-full h-screen flex  items-center  flex-col sm:w-6/12">
                <h1 className="text-5xl font-sans my-10 font-bold">SIGN-UP</h1>
                <form
                    onSubmit={handleSubmit}
                    className="h-[65vh] w-[85vw] sm:w-[50vh] flex items-center justify-evenly flex-col rounded-2xl border-purple-500 border-1 bg-gray-950/30 backdrop-blur-none shadow-md shadow-purple-500">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        onChange={handleFormChange}
                        value={formData.name}
                        className=" border-1 border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={handleFormChange}
                        name="email"
                        value={formData.email}
                        className="border-1 border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    <input
                        type="phone"
                        placeholder="Enter your phone number"
                        onChange={handleFormChange}
                        name="phone"
                        value={formData.phone}
                        className="border-1 border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    <input
                        type="password"
                        placeholder="Create password"
                        onChange={handleFormChange}
                        name="password"
                        value={formData.password}
                        className="border-1 border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        onChange={handleFormChange}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        className="border-1 border-gray-500 px-4 sm:w-[19vw] w-[60vw] h-[5vh] rounded-md"></input>
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="border-1 border-gray-500 sm:w-[12vw]  w-[50vw] h-[5vh] rounded-md">
                        Submit
                    </button>
                    <p className="text-gray-500">
                        Alredy have an account?{" "}
                        <a href="/sign-in" className="text-sky-500">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default signup;
