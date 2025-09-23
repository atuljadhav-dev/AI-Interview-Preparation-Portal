"use client";
import { useUser } from "@/utils/UserData";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Interview = ({ id }) => {
    const [conversation, setConversation] = useState([]);
    const [input, setInput] = useState("");
    const [interview, setInterview] = useState({});
    const { resume } = useUser();
    const [lastAIResponse, setLastAIResponse] = useState("");
    const router = useRouter();
    useEffect(() => {
        try {
            const fetchData = async () => {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview/specific/${id}`
                );
                setInterview(res.data.data);
                if (res.data.data.status == "Done") {
                    router.push(`/feedback/${res.data.data.feedbackId}`);
                }
            };
            fetchData();
        } catch (e) {
            console.log(e);
        }
    }, []);
    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = { role: "user", parts: [{ text: input }] };
        const updatedConversation = [...conversation, newMessage];

        setConversation(updatedConversation);
        setInput("");

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/interview-stimulation`,
                {
                    jobDescription: interview.jobDescription,
                    roundName: interview.roundName,
                    userId: interview.userId,
                    questions: interview.questions,
                    content: updatedConversation,
                    resume,
                }
            );

            const aiResponse = {
                role: "model",
                parts: [{ text: res.data.data }],
            };

            if (res.data.data.includes("quit")) {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/conversation`,
                    {
                        userId: interview.userId,
                        interviewId: interview._id,
                        conversations: finalConversation,
                    }
                );

                const feedback = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/generate-feedback`,
                    {
                        resume,
                        questionAnswer: interview.questions,
                        userAnswer: finalConversation,
                        jobDescription: interview.jobDescription,
                        roundName: interview.roundName,
                        jobTitle: interview.title,
                    }
                );

                const feedbackSave = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
                    {
                        feedback: feedback.data.data,
                        interviewId: interview._id,
                    }
                );
                router.push(`/feedback/${interview._id}`);
            }
            const finalConversation = [...updatedConversation, aiResponse];
            setConversation(finalConversation);
            setLastAIResponse(res.data.data);
        } catch (e) {
            console.error("Interview error:", e);
        }
    };

    return (
        <div className="w-full h-screen bg-gray-900 ">
            <div className="h-[70vh] w-full flex flex-row-reverse">
                {/* this is left */}
                <div className="h-[70vh] w-6/12  flex items-center justify-center">
                    <div className="h-[60vh] w-[45vw] shadow-md shadow-purple-500  border-2  border-purple-500 rounded-xl backdrop-blur-none flex justify-center items-center bg-white/10">
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
                {/* this is right */}
                <div className="h-[70vh] w-6/12 flex items-center justify-center">
                    <div className="h-[60vh] w-[45vw] border-2  border-purple-500 rounded-xl backdrop-blur-none shadow-md shadow-purple-500  bg-white/10 ">
                        <video
                            className="h-full w-full object-cover rounded-lg"
                            control
                            autoPlay
                            src="/interview.mp4"
                            loop
                            muted></video>
                    </div>
                </div>
            </div>
            <div className="h-[30vh] w-full flex items-center justify-center">
                <div className="h-[25vh] w-[97vw] border-2 flex flex-col border-purple-500 rounded-xl backdrop-blur-none bg-white/10 p-4">
                    <p className="text-lg">{lastAIResponse}</p>
                    <div className="w-full flex justify-between gap-4 mt-auto">
                        <input
                            type="text"
                            placeholder="Any question"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="rounded-xl backdrop-blur-none  bg-white/10 w-[70vw] h-[5vh] mt-auto p-4"
                        />
                        <button
                            className="bg-purple-500 p-1 rounded mx-12 px-5"
                            onClick={handleSend}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Interview;
