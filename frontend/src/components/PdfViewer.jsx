"use client";

import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PdfViewer = ({ id }) => {
    const { resume, setResume } = useUser();
    const [data, setData] = useState(null);
    const [url, setUrl] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (!data && resume) {
            const filter = resume.filter((cur) => cur._id == id);
            if (!filter || filter.length == 0 || !filter[0].url) {
                router.back();
                return;
            }
            setData(filter[0]);
            setUrl(filter[0]?.url ? filter[0].url : "");
        }
    }, [id, resume]);
    const handleDelete = async () => {
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
                { params: { profileId: id }, withCredentials: true }
            );
            if (res.data.success) {
                setUrl("");
                setResume((prev) => prev.filter((cur) => cur._id !== id));
                router.back();
            }
        } catch (e) {}
    };
    return (
        <div className="relative w-full h-[90vh] border border-gray-300 rounded-md overflow-hidden">
            {" "}
            <button
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-md hover:bg-red-600"
                onClick={handleDelete}>
                <Trash />
            </button>
            <div className="w-full h-full">
                {url ? (
                    <iframe
                        src={url}
                        className="w-full h-full"
                        title="PDF Viewer"></iframe>
                ) : (
                    <p>No Resume Found</p>
                )}
            </div>
        </div>
    );
};
export default PdfViewer;
