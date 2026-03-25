"use client";

import { useUser } from "@/hooks/useUser";
import api from "@/utils/api";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PdfViewer = ({ id }) => {
    const { resumes, setResumes } = useUser();
    const [data, setData] = useState(null);
    const [url, setUrl] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (!data && resumes) {
            const filter = resumes.filter((cur) => cur._id == id);
            if (!filter || filter.length == 0 || !filter[0].url) {
                router.back();
                return;
            }
            setData(filter[0]);
            setUrl(filter[0]?.url ? filter[0].url : "");
        }
    }, [id, resumes]);
    const handleDelete = async () => {
        try {
            const res = await api.delete("/profile", {
                params: { profileId: id },
            });
            if (res.data.success) {
                setUrl("");
                setResumes((prev) => prev.filter((cur) => cur._id !== id));
                router.back();
            }
            toast.success("Resume deleted successfully.");
        } catch (e) {
            toast.error("Failed to delete resume.");
        }
    };
    return (
        <div className="w-full h-full border border-gray-300 rounded-md ">
            <button
                className="fixed top-16 cursor-pointer right-2 p-2 rounded-md "
                onClick={handleDelete}>
                <Trash />
            </button>
            {url ? (
                <iframe
                    src={url}
                    className="w-full h-full"
                    title="PDF Viewer"></iframe>
            ) : (
                <p>No Resume Found</p>
            )}
        </div>
    );
};
export default PdfViewer;
