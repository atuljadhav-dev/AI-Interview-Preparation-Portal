"use client";
import ResumePreview from "@/components/ResumePreview";
import { useUser } from "@/hooks/useUser";
import api from "@/utils/api";
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
        const atsId = searchParams.get("atsId");
        if (!atsId) return;

        const loadData = async () => {
            try {
                const { data } = await api.get(`/ats/report/${atsId}`);

                const atsReport = data?.data;
                if (!atsReport) return;

                setReport(atsReport.atsReport);

                if (resumes && resumes.length > 0) {
                    const foundResume = resumes.find(
                        (cur) =>
                            cur._id?.toString() ===
                            atsReport.resumeId?.toString()
                    );

                    if (foundResume) {
                        setSelectedResume(foundResume);
                    }
                }

                if (atsReport.jobId) {
                    const jobRes = await api.get(`/job/${atsReport.jobId}`);
                    setJobDescription(jobRes?.data?.data?.jobDescription || "");
                }

                toast.success("Report loaded successfully.");
            } catch (error) {
                console.error(error);
                toast.error("Failed to load ATS report.");
            }
        };

        loadData();
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
            const { data } = await api.post("/ai/resume", {
                jobDescription,
                resume: selectedResume.resume,
                atsReport: report,
                additionalResumes: tmp,
            });
            setResume(data?.data);
            console.log(data);
            toast.success("Resume generated successfully.");
        } catch (e) {
            toast.error("Failed to generate Resume.");
        }
    };
    return (
        <div className="min-h-screen p-4 flex items-center justify-center">
            <div
                className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    Resume Optimization
                </h1>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 w-[90vw] sm:w-[420px] border border-white/30 dark:border-gray-700 transition">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Job Description
                        </label>
                        <input
                            type="text"
                            value={jobDescription}
                            placeholder="job"
                            onChange={(e) => {
                                setJobDescription(e.target.value);
                            }}
                            className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                    </div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ATS Report
                    </label>
                    <input
                        type="text"
                        value={report ? JSON.stringify(report) : ""}
                        onChange={(e) => {
                            setReport(e.target.value);
                        }}
                        className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    {/* show additional resume to select */}
                    {resumes?.map(
                        (r) =>
                            selectedResume &&
                            r._id !== selectedResume._id && (
                                <div key={r._id}>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Additional Resume To Select{" "}
                                    </label>
                                    <input
                                        type="checkbox"
                                        value={r._id}
                                        checked={additionalResumes.includes(
                                            r._id
                                        )}
                                        className=" px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                if (
                                                    additionalResumes.length >=
                                                    4
                                                ) {
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
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 rounded-lg font-semibold
          bg-gradient-to-r from-purple-600 to-blue-600 text-white 
          hover:scale-[1.02] hover:shadow-lg transition duration-300">
                        submit
                    </button>
                </div>
                {resume && <ResumePreview resume={resume} />}
            </div>
        </div>
    );
};

export default ResumePage;
