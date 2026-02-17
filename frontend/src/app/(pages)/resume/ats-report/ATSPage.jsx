"use client";
import ATSCard from "@/components/ATSCard";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [reports, setReports] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const { resumes } = useUser();
    const [jobs, setJobs] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/ats/reports?page=${page}&limit=${limit}`,
                    {
                        withCredentials: true,
                    }
                );
                setReports(data?.data.reports);
                setTotalPages(data?.data.totalPages);
            } catch (e) {
                toast.error("Failed to fetch reports.");
            }
        };
        fetchReports();
    }, []);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/jobs`,
                    {
                        withCredentials: true,
                    }
                );
                setJobs(data?.data.jobs);
            } catch (e) {
                toast.error("Failed to fetch jobs.");
            }
        };
        fetchJobs();
    }, []);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ats/generate`,
                {
                    jobDescription,
                    resume: selectedResume,
                    title,
                    jobId,
                },
                {
                    withCredentials: true,
                }
            );
            router.push(`/resume/ats-report/${data?.data?._id}`);
            toast.success("Resume analyzed successfully.");
        } catch (e) {
            toast.error("Failed to analyze resume.");
            console.error(e.response?.data || e.message);
        }
    };

    return (
        <div>
            <h1>ATS Report</h1>
            <input
                type="text"
                placeholder="Report Title"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <input
                type="text"
                value={jobDescription}
                placeholder="Job Description"
                onChange={(e) => {
                    setJobDescription(e.target.value);
                }}
            />
            {jobs && jobs.length > 0 ? (
                <select
                    value={jobId || ""}
                    onChange={(e) => {
                        setJobId(e.target.value);
                    }}>
                    <option value="">Select Job</option>
                    {jobs.map((job) => (
                        <option key={job._id} value={job._id}>
                            {job.title}
                        </option>
                    ))}
                </select>
            ) : (
                <div>No Jobs Found</div>
            )}
            {resumes && resumes.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resumes.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res);
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
            {reports && reports.length > 0 ? (
                <div>
                    <h2>Previous Reports</h2>

                    {reports.map((report) => (
                        <ATSCard data={report} key={report._id} />
                    ))}

                    <button
                        disabled={page <= 1}
                        onClick={() => {
                            setPage((prev) => prev - 1);
                        }}>
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => {
                            setPage((prev) => prev + 1);
                        }}>
                        Next
                    </button>
                </div>
            ) : (
                <div>No Previous Reports</div>
            )}
        </div>
    );
};

export default ResumePage;
