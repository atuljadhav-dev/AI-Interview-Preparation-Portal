"use client";

import { useState } from "react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProfileUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState("");
    const router = useRouter();
    const { setLoading } = useUser();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        if(!name){
            toast.error("Please enter a name for the resume");
            return;
        }
        if (uploading) return;
        const data = new FormData();
        data.append("file", file);
        data.append("name", name);
        setUploading(true);
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
            setLoading(true);
            toast.success("Resume uploded successfully");
            router.back();
        } catch (err) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex flex-col items-center justify-start p-6">
            <h1 className="text-2xl font-bold text-white mt-6">
                Upload Resume
            </h1>
            <form
                onSubmit={handleSubmit}
                className="p-6 rounded-lg border-2  border-purple-600 transition-colors flex items-center justify-center flex-col">
                <input
                    type="text"
                    autoFocus
                    placeholder="Enter name to resume Eg.Software Engineer Resume"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4 p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-gray-300 h-10 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 "
                />
                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-purple-500 text-white cursor-pointer px-4 py-2 rounded-md m-3">
                    Upload
                </button>
            </form>
        </div>
    );
}
