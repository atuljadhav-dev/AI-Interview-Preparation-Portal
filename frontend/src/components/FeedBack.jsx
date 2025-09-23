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
        if (loading) return;
        if (!user?._id) return;

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
                            interview_id: res.data.data.interviewId, // ✅ use directly
                            userId: user._id,
                        },
                    }
                );
                console.log("Conversation:", con.data);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };

        fetchData();
    }, [user, id, loading]);

    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <h1 className="text-5xl font-sans mt-10 pt-5 font-bold text-center">
                Feedback
            </h1>
            <div className="bg-gray-950 min-h-screen flex items-start flex-col justify-center text-white">
                <div className="">
                    <h2>Job Title: {feedback?.jobTitle}</h2>
                    <h2>Round Name: {feedback?.roundName}</h2>
                    <h3>Job Description :{interview?.jobDescription}</h3>
                </div>
                <div>
                    <h4>Interview Score: {feedback?.evaluation?.score}/10</h4>
                    <h4>Justification :</h4>
                    <h5>{feedback?.evaluation?.justification}</h5>
                </div>
                <h4>Strengths:</h4>
                <h2>
                    {feedback?.evaluation?.strengths?.length != 0 ? (
                        <>
                            {feedback?.evaluation?.strengths.map((cur, idx) => {
                                return <h5 key={idx}>{cur}</h5>;
                            })}
                        </>
                    ) : (
                        <>No Strengths in the candidate.</>
                    )}
                </h2>
                <h4>Weaknesses:</h4>
                <h2>
                    {feedback?.evaluation?.weaknesses?.length != 0 ? (
                        <>
                            {feedback?.evaluation?.weaknesses.map(
                                (cur, idx) => {
                                    return <h5 key={idx}>◼{cur}</h5>;
                                }
                            )}
                        </>
                    ) : (
                        <>No noticeable shortcomings were observed.</>
                    )}
                </h2>
                <h3>Question And Expected Answers:</h3>
                <h2>
                    {interview?.questions?.map((cur, idx) => {
                        return (
                            <>
                                <h4>Question :</h4>
                                <h5>{cur.question}</h5>
                                <h4>Expected Answer :</h4>
                                <h5>{cur.answer}</h5>
                            </>
                        );
                    })}
                </h2>
            </div>
        </div>
    );
};

export default FeedBack;
