"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import api from "@/utils/api";

export default function ProfileUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState("");
    const [available, setAvailable] = useState(true);
    const debouncedName = useDebounce(name, 500);
    const router = useRouter();
    const { refreshResume, resumes } = useUser();
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    useEffect(() => {
        const checkAvialability = () => {
            if (resumes && resumes.some((res) => res.name === debouncedName)) {
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
            const res = await api.post("/resume", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            refreshResume(); //refresh the resume list after successful upload
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
            <div
                className="flex flex-col items-center justify-start 
      px-4 py-8 
      bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-lack dark:text-white">
                    Upload Resume
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md p-6 rounded-2xl 
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
        border border-purple-200 dark:border-gray-700 
        shadow-lg flex flex-col gap-4 transition">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Resume Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Software Engineer Resume"
                            className="p-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                    </div>

                    {name &&
                        (available ? (
                            <p className="text-green-600 text-sm font-medium">
                                ✅ {name} is available
                            </p>
                        ) : (
                            <p className="text-red-600 text-sm font-medium">
                                ❌ {name} is not available
                            </p>
                        ))}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Upload PDF
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="block w-full p-2 rounded-lg border border-purple-300 
            cursor-pointer focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`w-full py-2 rounded-lg text-white font-semibold 
          bg-gradient-to-r from-purple-600 to-blue-600
          transition duration-300 
          ${
              uploading
                  ? "opacity-50 cursor-not-allowed animate-pulse"
                  : "hover:scale-[1.03] hover:shadow-lg"
          }`}>
                        {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 grid gap-4">
                <div className="text-2xl">Past Resumes</div>
                {resumes?.map((res) => (
                    <div
                        key={res._id}
                        className="p-5 rounded-xl 
          bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
          border border-purple-200 dark:border-gray-700 
          shadow-md hover:shadow-xl hover:scale-[1.02] 
          transition duration-300 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {res.name}
                        </h2>

                        <Link
                            href={`/resume/${res._id}`}
                            className="text-purple-600 dark:text-purple-400 
            font-medium hover:underline">
                            View →
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
