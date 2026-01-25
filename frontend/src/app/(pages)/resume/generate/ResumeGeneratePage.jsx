"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [Resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const { resume } = useUser();
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ai/resume`,
                {
                    jobDescription,
                    resume: selectedResume,
                    atsReport: {},
                    additionalResumes: [],
                },
                {
                    withCredentials: true,
                }
            );
            setResume(data?.data);
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
            {resume && resume.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resume.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res.resume);
                    }}>
                    <option value="">Select Resume</option>
                    {resume.map((res) => (
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
