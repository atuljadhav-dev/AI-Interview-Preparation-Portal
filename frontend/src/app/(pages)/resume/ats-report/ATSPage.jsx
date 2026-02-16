"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [reports, setReports] = useState(null);
    const [jobDescription, setJobDescription] =
        useState(`A MERN Developer specializes in building full-stack web applications using a unified JavaScript ecosystem. The term is an acronym for the four core technologies used: MongoDB, Express.js, React.js, and Node.js.

Core Stack Components
The MERN stack is designed to handle the entire development lifecycle, from the user interface to the database.

MongoDB (Database): A NoSQL, document-oriented database that stores data in flexible, JSON-like formats (BSON).

Express.js (Backend Framework): A minimalist web framework for Node.js used to build robust server-side logic and RESTful APIs.

React.js (Frontend Library): A library developed by Meta for building dynamic, component-based user interfaces with an efficient Virtual DOM for fast rendering.

Node.js (Runtime Environment): A JavaScript runtime that allows code to run on the server side, utilizing an event-driven, non-blocking I/O model for high performance.

Key Responsibilities
A MERN developer manages both client-side and server-side development.

Frontend Development: Building responsive and interactive user interfaces using React components, state management (e.g., Redux or Context API), and modern CSS.

Backend Development: Creating scalable server-side applications and managing API endpoints with Node.js and Express.

Database Management: Designing schemas, handling data storage, and optimizing queries in MongoDB.

API Integration: Connecting the frontend to the backend via RESTful services or GraphQL, often using tools like Axios or the Fetch API.

Maintenance and Testing: Debugging, writing unit tests (using Jest or Mocha), and optimizing performance across the entire stack.`);
    const [selectedResume, setSelectedResume] = useState(null);
    const router = useRouter();
    const { resumes } = useUser();
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/ats/reports`,
                    {
                        withCredentials: true,
                    }
                );
                setReports(data?.data);
            } catch (e) {
                toast.error("Failed to fetch reports.");
            }
        };
        fetchReports();
    }, []);

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ats/generate`,
                {
                    jobDescription,
                    resume: selectedResume,
                },
                {
                    withCredentials: true,
                }
            );
            router.push(`/resume/ats-report/${data?.data?._id}`);
            toast.success("Resume analyzed successfully.");
        } catch (e) {
            toast.error("Failed to analyze resume.");
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
        </div>
    );
};

export default ResumePage;
