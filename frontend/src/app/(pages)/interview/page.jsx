"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export const metadata = {
    title: "Create Interview - PlacementReady",
    description:
        "Create a new interview session on PlacementReady. Input job role, description, and select your resume to start practicing for your interviews.",
};

const page = () => {
    const { resume, user, loading } = useUser();
    const router = useRouter();
    const textareaRef = useRef(null);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        jobRole: "",
        jobDescription: "",
        round_name: "",
        resumeId: "",
        resume: {},
    });
    useEffect(() => {
        if (!user) return;

        if (!resume && !loading) {
            toast.info("Please upload or attach your resume");
            router.push("/userdata");
        }
    }, [resume, user]);
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [formData.jobDescription]);
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.jobRole.trim()) {
            toast.error("Please enter a job role");
            return;
        }
        if (!formData.jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }
        if (!formData.resumeId) {
            toast.error(
                "Please upload or attach a resume before creating the interview"
            );
            return;
        }
        if (sending) return;
        try {
            setSending(true);
            const filterResume = resume.filter(
                (cur) => cur._id == formData.resumeId
            );
            formData.resume = filterResume[0]?.resume;
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/interview`,
                formData,
                { withCredentials: true }
            );
            toast.success("Interview Created successfully");
            //  router.push(`/interview/${res.data.data._id}`);
        } catch (e) {
            console.log(e);
            // toast.error(e.response.data.error);
        } finally {
            setSending(false);
        }
    };
    return (
        <>
            <div className="bg-gray-950  flex items-center  justify-center p-6">
                <form
                    method="POST"
                    onSubmit={handleSubmit}
                    className="w-full max-w-4xl bg-gray-900 border-2 border-purple-900  shadow-md shadow-purple-500 rounded-xl  p-8 space-y-8">
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Job Role
                        </h2>
                        <input
                            type="text"
                            name="jobRole"
                            autoFocus
                            value={formData.jobRole}
                            onChange={handleFormChange}
                            className="block w-full text-gray-300 bg-gray-800 pl-3 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Description
                        </h2>
                        <textarea
                            name="jobDescription"
                            rows={5}
                            ref={textareaRef}
                            value={formData.jobDescription}
                            onChange={handleFormChange}
                            style={{ height: "auto", overflow: "hidden" }}
                            className="resize-none overflow-hidden px-3 w-full text-gray-300 bg-gray-800 rounded-lg border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"></textarea>
                    </div>
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-whiet mb-2">
                            Select the resume
                        </h2>
                        <select
                            name="resumeId"
                            value={formData.resumeId}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value === "add") {
                                    router.push("/userdata");
                                    return;
                                }

                                handleFormChange(e);
                            }}
                            className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-600">
                            <option value="" disabled>
                                Select Resume
                            </option>
                            {resume &&
                                resume.map((cur) => {
                                    return (
                                        <option value={cur._id}>
                                            {cur.name}
                                        </option>
                                    );
                                })}
                            <option value="add">Add New Resume</option>
                        </select>
                    </div>
                    <div className="p-6 rounded-lg border-2 border-gray-700 hover:border-purple-600 transition-colors">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Select Interview Round
                        </h2>
                        <input
                            list="round_name"
                            name="round_name"
                            value={formData.round_name}
                            onChange={handleFormChange}
                            className="w-full bg-gray-800 text-gray-300 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-600"
                        />
                        <datalist id="round_name">
                            <option value="Technical Round" />
                            <option value="HR Round" />
                            <option value="Managerial Round" />
                            <option value="Final Round" />
                        </datalist>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={sending}
                            className="bg-linear-to-r from-purple-600 to-purple-800 cursor-pointer text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg 
                     hover:from-purple-700 hover:to-purple-900 transform hover:scale-105 transition duration-300 ease-in-out">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default page;
