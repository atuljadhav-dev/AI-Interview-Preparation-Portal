"use client";

import { useUser } from "@/utils/UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const login = () => {
    const [formData, setFormData] = useState({
        password: "",
        identifier: "",
    });
    const router = useRouter();
    const { setUser } = useUser();
    const handleSend = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
                formData,
                { withCredentials: true }
            );
            if (res.data.success) {
                setUser(res.data.data);
                toast.success("Signup success");
                router.push("/home");
            }
        } catch (err) {
            toast.error(err.response.data.error);
        }
    };
    return (
        <div className="w-full h-screen bg-linear-to-r from-gray-600 to-black-500 flex  items-center justify-center sm:flex-row text-white">
            <div className="w-full  h-screen flex justify-center m-auto items-center flex-col sm:w-6/12">
                <h1 className="text-5xl font-sans my-10 font-bold">LOGIN</h1>

                <form
                    onSubmit={handleSend}
                    className="h-[55vh] w-[85vw] flex items-center justify-center sm:w-[50vh] gap-5 flex-col rounded-2xl border-purple-500 border bg-gray-950/30 backdrop-blur-none shadow-md shadow-purple-500">
                    <input
                        type="text"
                        placeholder="Enter email or phone number"
                        name="identifier"
                        value={formData.identifier}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                identifier: e.target.value,
                            })
                        }
                        className=" bg-transparent border border-gray-500 px-4 w-[60vw] h-[5vh] sm:w-[19vw] rounded-md"></input>

                    <input
                        type="password"
                        placeholder="Enter password"
                        name="password"
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
                        className="border border-gray-500 cursor-pointer  w-[50vw] h-[5vh] sm:w-[12vw] rounded-md">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
export default login;
