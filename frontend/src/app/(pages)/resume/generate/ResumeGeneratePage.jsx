"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const searchParams = useSearchParams();
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const [report, setReport] = useState({});
    const [additionalResumes, setAdditionalResumes] = useState([]);
    const { resumes } = useUser();
    useEffect(() => {
        const dataParam = searchParams.get("data");
        if (dataParam && resumes) {
            try {
                const data = JSON.parse(decodeURIComponent(dataParam));
                setJobDescription(data.jobDescription || "");
                setReport(data.atsReport || "");
                const selected = resumes.find((cur) => cur._id === data.resume);
                setSelectedResume(selected || null);
                toast.success("Data loaded from URL successfully.");
            } catch (err) {
                toast.error("Failed to parse data from URL.");
            }
        }
    }, [searchParams, resumes]);
    const handleSubmit = async () => {
        // Filter out the selected resume and get the resume data for the additional resumes
        const tmp = resumes
            .filter(
                (cur) =>
                    cur._id !== selectedResume._id &&
                    additionalResumes.includes(cur._id)
            )
            .map((cur) => cur.resume);
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ai/resume`,
                {
                    jobDescription,
                    resume: selectedResume.resume,
                    atsReport: report,
                    additionalResumes: tmp,
                },
                {
                    withCredentials: true,
                }
            );
            setResume(data?.data);
            toast.success("Resume generated successfully.");
        } catch (e) {
            toast.error("Failed to generate Resume.");
        }
    };
    return (
        <div>
            <input
                type="text"
                value={jobDescription}
                onChange={(e) => {
                    setJobDescription(e.target.value);
                }}
            />
            <input
                type="text"
                value={report ? JSON.stringify(report) : ""}
                onChange={(e) => {
                    setReport(e.target.value);
                }}
            />
            {/* show additional resume to select */}
            {resumes?.map(
                (r) =>
                    selectedResume &&
                    r._id !== selectedResume._id && (
                        <div key={r._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    value={r._id}
                                    checked={additionalResumes.includes(r._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            if (additionalResumes.length >= 4) {
                                                alert(
                                                    "You can select maximum 4 additional resumes."
                                                );
                                                return;
                                            }
                                            setAdditionalResumes([
                                                ...additionalResumes,
                                                r._id,
                                            ]);
                                        } else {
                                            setAdditionalResumes(
                                                additionalResumes.filter(
                                                    (id) => id !== r._id
                                                )
                                            );
                                        }
                                    }}
                                />
                                {r.name}
                            </label>
                        </div>
                    )
            )}

            {/* select primary resume */}
            {resumes && resumes.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resumes.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res ? res : null);
                    }}>
                    <option value="">Select Resume</option>
                    {resumes.map((res) => (
                        <option key={res._id} value={res._id}>
                            {res.name}
                        </option>
                    ))}
                </select>
            ) : (
                <div>No Resumes Found</div>
            )}
            <button onClick={handleSubmit}>submit</button>
        </div>
    );
};

export default ResumePage;
