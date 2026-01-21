"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";

export default function ProfileUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState("");
    const [available, setAvailable] = useState(true);
    const debouncedName = useDebounce(name, 500);
    const router = useRouter();
    const { setLoading, resume } = useUser();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    useEffect(() => {
        const checkAvialability = () => {
            if (resume && resume.some((res) => res.name === debouncedName)) {
                setAvailable(false);
            } else {
                setAvailable(true);
            }
        };
        if (debouncedName) {
            checkAvialability();
        }
    }, [debouncedName]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        if (!name) {
            toast.error("Please enter a name for the resume");
            return;
        }
        if (!available) {
            toast.error("Please choose a different name for the resume");
            return;
        }
        if (uploading) return;
        const data = new FormData();
        data.append("file", file);
        data.append("name", name);
        setUploading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/resume`,
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
        <>
            {" "}
            <div className="min-h-screen flex flex-col items-center justify-start p-6">
                <h1 className="text-2xl font-bold mt-6">Upload Resume</h1>
                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-lg border-2  border-purple-600 transition-colors flex items-center justify-center flex-col">
                    <input
                        type="text"
                        autoFocus
                        placeholder="Enter name to resume Eg.Software Engineer Resume"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
                    />
                    {name &&
                        (available ? (
                            <p className="pb-2 text-green-600">
                                ✅ {name} is available.
                            </p>
                        ) : (
                            <p className="pb-2 text-red-600">
                                {" "}
                                ❌ {name} is not available.
                            </p>
                        ))}
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="block w-full h-10  rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 "
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`bg-purple-500 text-white cursor-pointer px-4 py-2 rounded-md m-3 ${
                            uploading
                                ? "cursor-not-allowed animate-pulse"
                                : "hover:bg-purple-600"
                        }`}>
                        {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>
            </div>
            {resume?.map((res) => (
                <div
                    key={res._id}
                    className="p-4 m-4 border border-gray-600 rounded-lg">
                    <h2 className="text-xl font-semibold ">{res.name}</h2>
                    <Link
                        href={`/resume/${res._id}`}
                        className="text-purple-800 dark:text-purple-400 hover:underline">
                        View Resume
                    </Link>
                </div>
            ))}
        </>
    );
}
