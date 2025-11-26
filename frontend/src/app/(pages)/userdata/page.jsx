"use client";

import { useState } from "react";
import axios from "axios";
import { useUser } from "@/utils/UserData";
import { toast } from "react-toastify";

export default function ProfileUpload() {
    const [file, setFile] = useState(null);
    const { user } = useUser();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }
        const data = new FormData();
        data.append("file", file);
        data.append("name", "test");
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.log(e);
            toast.error("Upload failed. Please try again.");
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex flex-col items-center justify-start p-6">
            {/* <div className="w-[40vw] h-[60vh] bg-red-500 flex-col items-center justify-evenly"> */}
            <h1 class="text-2xl font-bold text-white mt-6">Upload Resume</h1>
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-lg border-2  border-purple-600 transition-colors flex items-center justify-center flex-col">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-gray-300 h-10 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 "
                />
                <button
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded-md m-3">
                    Upload
                </button>
            </form>
        </div>
    );
}
