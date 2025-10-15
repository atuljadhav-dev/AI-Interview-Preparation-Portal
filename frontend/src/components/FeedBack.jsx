"use client";
import { useUser } from "@/utils/UserData";
import axios from "axios";
import React, { useEffect, useState } from "react";

const FeedBack = ({ id }) => {
    const [feedback, setFeedback] = useState({});
    const [interview, setInterview] = useState({});
    const [conversation, setConversation] = useState([]);
    const { user, loading } = useUser();

    useEffect(() => {
        if (loading || !user?._id) return;
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback/${id}`
                );
                setFeedback(res.data.data.feedback);

                const int = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview/specific/${res.data.data.interviewId}`
                );
                setInterview(int.data.data);

                const con = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/conversation`,
                    {
                        params: {
                            interview_id: res.data.data.interviewId,
                            userId: user._id,
                        },
                    }
                );
                setConversation(con.data.data);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        fetchData();
    }, [user, id, loading]);

    return (
        <div className="bg-gray-950 min-h-screen text-white py-10 px-5">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-indigo-400">
                Interview Feedback
            </h1>

            <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Job Details
                    </h2>
                    <div className="space-y-2 text-gray-300">
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
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Evaluation Summary
                    </h2>
                    <div className="space-y-4 text-gray-300">
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
                            <p className="mt-1 text-gray-400">
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
                        <ul className="list-disc ml-6 text-gray-300 space-y-1">
                            {feedback.evaluation.strengths.map((cur, idx) => (
                                <li key={idx}>{cur}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">
                            No strengths were recorded.
                        </p>
                    )}
                </section>
                <section>
                    <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">
                        Weaknesses
                    </h2>
                    {feedback?.evaluation?.weaknesses?.length ? (
                        <ul className="list-disc ml-6 text-gray-300 space-y-1">
                            {feedback.evaluation.weaknesses.map((cur, idx) => (
                                <li key={idx}>{cur}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">
                            No noticeable shortcomings observed.
                        </p>
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
                                    className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                    <h4 className="text-indigo-400 font-semibold">
                                        Question {idx + 1}:
                                    </h4>
                                    <p className="text-gray-200 mt-1">
                                        {cur.question}
                                    </p>
                                    <h5 className="text-indigo-400 font-semibold mt-3">
                                        Expected Answer:
                                    </h5>
                                    <p className="text-gray-300 mt-1">
                                        {cur.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">
                            No questions available for this interview.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FeedBack;
