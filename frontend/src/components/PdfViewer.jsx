"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

export default function PdfViewer({ id }) {
    const { resume } = useUser();
    const [data, setData] = useState(null);
    const [url, setUrl] = useState("");
    useEffect(() => {
        if (!data && resume) {
            const filter = resume.filter((cur) => cur._id == id);
            setData(filter[0]);
            console.log(filter[0]);
        }
    }, [id, resume]);
    return (
        <div className="w-full h-screen">
            <iframe
                src={`https://docs.google.com/gview?url=${data?.url}&embedded=true`}
                className="w-full h-full border-none"
                title="Resume PDF"
            />
        </div>
    );
}
