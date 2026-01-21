"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FeedBackPage = ({ id }) => {
    const [feedback, setFeedback] = useState({});
    const [interview, setInterview] = useState({});
    const [conversation, setConversation] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const { user, loading } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (loading || !user?._id) return;
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${id}`,
                    { withCredentials: true }
                );
                setFeedback(res.data.data.feedback);
            } catch (e) {
                toast.error("Failed to fetch feedback data.");
                router.back();
            }
            try {
                const int = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${id}`,
                    { withCredentials: true }
                );
                setInterview(int.data.data);
            } catch (e) {
                toast.error("Failed to fetch interview data.");
            }
            try {
                const con = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/conversation`,
                    {
                        params: {
                            interviewId: id,
                        },
                        withCredentials: true,
                    }
                );
                setConversation(con.data.data.conversations);
            } catch (e) {
                toast.error("Failed to fetch conversation data");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [user, id, loading]);
    if (isFetching || loading) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <svg
                    aria-hidden="true"
                    className="w-16 h-16  animate-spin fill-indigo-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <p className="mt-4 text-indigo-400 font-medium animate-pulse">
                    Generating your report...
                </p>
            </div>
        );
    }
    const getLevel = (rating) => {
        if (rating >= 5)
            return { label: "Expert", color: "bg-indigo-100 text-indigo-700" };
        if (rating >= 4)
            return {
                label: "Advanced",
                color: "bg-emerald-100 text-emerald-700",
            };
        return { label: "Intermediate", color: "bg-blue-100 text-blue-700" };
    };
    return (
        <div className="min-h-screen py-10 px-5">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-indigo-400">
                Interview Feedback
            </h1>

            <div className="max-w-5xl mx-auto rounded-2xl shadow-lg p-6 space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Job Details
                    </h2>
                    <div className="space-y-2 ">
                        <p>
                            <span className="font-semibold text-indigo-400">
                                Job Title:
                            </span>{" "}
                            {feedback?.jobTitle || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold text-indigo-400">
                                Round Name:
                            </span>{" "}
                            {feedback?.roundName || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold text-indigo-400">
                                Job Description:
                            </span>{" "}
                            {interview?.jobDescription || "N/A"}
                        </p>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b text-indigo-400 border-gray-700 pb-2 mb-4">
                        Skill Rating
                    </h2>
                    <div className=" mx-auto p-6 rounded-xl shadow-md border border-slate-100">
                        <div className="flex justify-between gap-2 flex-wrap">
                            {feedback.skillsRating.map((skill, index) => (
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-slate-500">
                                        {skill.skill_name}
                                    </span>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-2 w-8 rounded-sm ${
                                                    i < skill.rating
                                                        ? "bg-sky-500"
                                                        : "bg-slate-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Evaluation Summary
                    </h2>
                    <div className="space-y-4 ">
                        <p>
                            <span className="font-semibold text-indigo-400">
                                Interview Score:
                            </span>{" "}
                            {feedback?.evaluation?.score ?? "N/A"}/10
                        </p>
                        <div>
                            <h4 className="font-semibold text-indigo-400">
                                Justification:
                            </h4>
                            <p className="mt-1 ">
                                {feedback?.evaluation?.justification ||
                                    "No justification provided."}
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Strengths
                    </h2>
                    {feedback?.evaluation?.strengths?.length ? (
                        <ul className="list-disc ml-6  space-y-1">
                            {feedback.evaluation.strengths.map((cur, idx) => (
                                <li key={idx}>{cur}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="">No strengths were recorded.</p>
                    )}
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Weaknesses
                    </h2>
                    {feedback?.evaluation?.weaknesses?.length ? (
                        <ul className="list-disc ml-6  space-y-1">
                            {feedback.evaluation.weaknesses.map((cur, idx) => (
                                <li key={idx}>{cur}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="">No noticeable shortcomings observed.</p>
                    )}
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Questions & Expected Answers
                    </h2>
                    {interview?.questions?.length ? (
                        <div className="space-y-6">
                            {interview.questions.map((cur, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-gray-700">
                                    <h4 className="text-indigo-400 font-semibold">
                                        Question {idx + 1}:
                                    </h4>
                                    <p className=" mt-1">{cur.question}</p>
                                    <h5 className="text-indigo-400 font-semibold mt-3">
                                        Expected Answer:
                                    </h5>
                                    <p className=" mt-1">{cur.answer}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="">
                            No questions available for this interview.
                        </p>
                    )}
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Conversation
                    </h2>

                    {conversation?.length ? (
                        <div className="space-y-4">
                            {conversation.map((msg, i) => {
                                const role = msg.role || "user";
                                const text =
                                    msg.parts?.map((p) => p.text).join("\n") ||
                                    "";
                                return (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-md ${
                                            role === "model"
                                                ? "bg-indigo-300 dark:bg-indigo-800"
                                                : ""
                                        }`}>
                                        <div className="text-sm font-medium mb-1">
                                            {role === "model" ? "AI" : "You"}
                                        </div>
                                        <div className="whitespace-pre-wrap text-sm">
                                            {text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="">No conversation found.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FeedBackPage;
