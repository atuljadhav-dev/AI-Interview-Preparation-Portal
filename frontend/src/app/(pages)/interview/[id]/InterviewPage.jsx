"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InterviewPage = ({ id }) => {
    const [conversation, setConversation] = useState([]);
    const [input, setInput] = useState(
        `Start Interview Current Time: ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "medium",
        })}`
    );
    const [currentResume, setCurrentResume] = useState(null);
    const [interview, setInterview] = useState({});
    const [sending, setSending] = useState(false);
    const { resume } = useUser();
    const [lastAIResponse, setLastAIResponse] = useState("");
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview/specific/${id}`,
                    { withCredentials: true }
                );
                setInterview(res.data.data);
                if (res.data.data.status == "Done") {
                    router.push(`/feedback/${id}`);
                }
            } catch (e) {
                toast.error("Failed to fetch interview data.");
                router.push("/home");
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (!resume || !interview) return;
        const filtered = resume.find((cur) => cur._id === interview.resumeId);
        if (filtered) {
            setCurrentResume(filtered.resume);
        }
    }, [resume, interview]);
    useEffect(() => {
        if (conversation.length == 0 && interview.questions && currentResume) {
            handleSend(); //auto send to start interview
        }
    }, [currentResume, interview]);
    const handleSend = async () => {
        if (!input.trim()) return; //avoid sending empty messages
        if (sending) return;
        const newMessage = { role: "user", parts: [{ text: input }] };
        setInput("");
        const updatedConversation = [...conversation, newMessage];

        setConversation(updatedConversation);

        try {
            setSending(true);
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/interview-stimulation`,
                {
                    jobDescription: interview.jobDescription,
                    roundName: interview.roundName,
                    questions: interview.questions,
                    content: updatedConversation,
                    resume: currentResume,
                },
                { withCredentials: true }
            );

            const aiResponse = {
                role: "model",
                parts: [{ text: res.data.data }],
            };
            const finalConversation = [...updatedConversation, aiResponse];
            setConversation(finalConversation);
            setLastAIResponse(res.data.data);
            if (res.data.data.includes("quit")) {
                //interview end condition
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/conversation`,
                    {
                        interviewId: interview._id,
                        conversations: finalConversation,
                    },
                    { withCredentials: true }
                );
                //generate feedback
                const feedback = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/generate-feedback`,
                    {
                        resume,
                        questionAnswer: interview.questions,
                        userAnswer: finalConversation,
                        jobDescription: interview.jobDescription,
                        roundName: interview.roundName,
                        jobTitle: interview.title,
                        skills: interview.skills,
                    },
                    { withCredentials: true }
                );
                //save feedback to db
                const feedbackSave = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
                    {
                        feedback: feedback.data.data,
                        interviewId: interview._id,
                    },
                    { withCredentials: true }
                );
                toast.success("Feedback generated successfully");
                router.push(`/feedback/${interview._id}`); //navigate to feedback page
            }
        } catch (e) {
            toast.error(e.response.data.error);
            console.log(e);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 ">
            <div className="h-[60vh] w-full flex flex-row-reverse">
                {/* this is left */}
                <div className="h-[60vh] w-6/12 hidden md:flex items-center justify-center">
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
                <div className="h-[60vh] w-full md:w-6/12 flex items-center justify-center">
                    <div className="h-[60vh] md:w-[45vw] border-2  border-purple-500 rounded-xl backdrop-blur-none shadow-md shadow-purple-500  bg-white/10 ">
                        <video
                            className="h-full w-full object-cover rounded-lg"
                            autoPlay
                            src="/interview.mp4"
                            loop
                            muted></video>
                    </div>
                </div>
            </div>
            <div className="min-h-[30vh] w-full flex items-center justify-center">
                <div className="min-h-[25vh] w-[97vw] border-2 flex flex-col border-purple-500 rounded-xl backdrop-blur-none bg-white/10 p-4">
                    <p className="text-lg text-white">{lastAIResponse}</p>
                    <div className="w-full flex items-end gap-4 mt-auto">
                        <textarea
                            rows={3}
                            cols={50}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="overflow-hidden rounded-xl backdrop-blur-none  bg-white/10 w-[70vw]  mt-auto p-2"></textarea>
                        <button
                            className="bg-purple-500 p-1 cursor-pointer rounded mx-12 px-5"
                            onClick={handleSend}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InterviewPage;
