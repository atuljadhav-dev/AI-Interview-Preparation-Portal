"use client";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const InterviewPage = ({ id }) => {
    const router = useRouter();
    const videoRef = useRef(null);
    const { resume } = useUser();

    // Context / Global States
    const [interview, setInterview] = useState({});
    const [currentResume, setCurrentResume] = useState(null);

    // Simulation States
    const [conversation, setConversation] = useState([]);
    const [input, setInput] = useState(
        `Start Interview. Current Time: ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "medium",
        })}`
    );
    const [lastAIResponse, setLastAIResponse] = useState("");
    const [sending, setSending] = useState(false);
    const [start, setStart] = useState(false);
    const [quit, setQuit] = useState(false);

    // Hooks - 4 second silence timeout as per instructions
    const { speak, isSpeaking } = useTextToSpeech();
    const { transcript, isListening, startListening, stopListening } =
        useSpeechToText(4000);

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${id}`,
                    { withCredentials: true }
                );
                setInterview(res.data.data);
                if (res.data.data.status === "Done") {
                    router.push(`/feedback/${id}`);
                }
            } catch (e) {
                toast.error("Session expired or invalid interview ID.");
                router.push("/home");
            }
        };
        fetchData();
    }, [id, router]);

    // 2. Resume Selection Sync
    useEffect(() => {
        if (!resume || !interview.resumeId) return;
        const filtered = resume.find((cur) => cur._id === interview.resumeId);
        if (filtered) setCurrentResume(filtered.resume);
    }, [resume, interview]);

    // 3. Centralized AI Speech Trigger
    useEffect(() => {
        if (lastAIResponse && start) {
            speak(lastAIResponse);
        }
    }, [lastAIResponse, start]);

    // 4. Video & Mic Handshake
    useEffect(() => {
        if (!videoRef.current) return;

        if (isSpeaking) {
            // Play Video from start when AI talks
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(console.error);
            stopListening(); // Don't listen to AI's own voice
        } else {
            videoRef.current.pause();
            // Start mic after AI is done, if session is active
            if (start && lastAIResponse && !sending && !quit) {
                startListening();
            }
        }
    }, [isSpeaking, start, sending, quit]);

    // 5. Microphone Transcript Sync
    useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    // 6. Automatic Detection: Submit when user stops talking
    useEffect(() => {
        const autoSubmit = async () => {
            if (
                !isListening &&
                input.trim() !== "" &&
                start &&
                !sending &&
                !quit
            ) {
                // Ensure we don't send the initial timestamp message automatically
                if (!input.includes("Start Interview")) {
                    await handleSend();
                }
            }
        };
        autoSubmit();
    }, [isListening]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        stopListening();
        setSending(true);
        if (!start) setStart(true);

        const newMessage = { role: "user", parts: [{ text: input }] };
        const updatedConversation = [...conversation, newMessage];
        setConversation(updatedConversation);
        setInput(""); // Reset input area

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ai/simulation`,
                {
                    jobDescription: interview.jobDescription,
                    roundName: interview.roundName,
                    questions: interview.questions,
                    content: updatedConversation,
                    resume: currentResume,
                },
                { withCredentials: true }
            );

            const aiText = res.data.data.trim();
            const aiResponseObj = { role: "model", parts: [{ text: aiText }] };
            const finalConversation = [...updatedConversation, aiResponseObj];
            setConversation(finalConversation);

            if (aiText.toLowerCase().endsWith("quit")) {
                let final = aiText.slice(0, -4).trim();
                if (final === "")
                    final = "Thank you for attending the interview.";

                setQuit(true);
                setLastAIResponse(final);
                stopListening();
                toast.info("Session complete. Analyzing performance...");

                // Process Feedback & Save (Async)
                const feedbackRes = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/ai/feedback`,
                    {
                        resume: currentResume,
                        questionAnswer: interview.questions,
                        userAnswer: finalConversation,
                        jobDescription: interview.jobDescription,
                        roundName: interview.roundName,
                        jobTitle: interview.title,
                        skills: interview.skills,
                    },
                    { withCredentials: true }
                );

                await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
                    {
                        feedback: feedbackRes.data.data,
                        interviewId: interview._id,
                    },
                    { withCredentials: true }
                );

                await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/conversation`,
                    {
                        interviewId: interview._id,
                        conversations: finalConversation,
                    },
                    { withCredentials: true }
                );

                router.push(`/feedback/${interview._id}`);
            } else {
                setLastAIResponse(aiText);
            }
        } catch (e) {
            toast.error(e.response?.data?.error || "AI Service unavailable.");
        } finally {
            setSending(false);
        }
    };

    if (!start) {
        return (
            <div className="w-full h-[90vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-center border border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-black text-purple-600 mb-2 uppercase tracking-tighter">
                        {interview.title || "Loading Interview..."}
                    </h1>
                    <p className="text-slate-500 font-medium mb-6">
                        {interview.roundName}
                    </p>

                    <div className="text-left bg-purple-50 dark:bg-slate-700/50 p-4 rounded-2xl mb-8">
                        <h2 className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-2 uppercase">
                            Pro-Tip:
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                            "The system automatically captures and submits your
                            answer after 4 seconds of silence."
                        </p>
                    </div>

                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-95"
                        onClick={handleSend}>
                        Begin Simulation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[90vh] bg-slate-100 dark:bg-slate-950 p-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse gap-6">
                {/* Right: AI Interviewer Video */}
                <div className="md:w-1/2 flex items-center justify-center">
                    <div className="relative aspect-video w-full rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-2xl bg-black">
                        {sending && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            className="h-full w-full object-cover"
                            src="/interview.mp4"
                            loop
                            playsInline
                            muted
                        />
                    </div>
                </div>

                {/* Left: AI Dialogue & Mic Feedback */}
                <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 min-h-[150px]">
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-2">
                            Interviewer
                        </span>
                        <p className="text-lg font-medium leading-relaxed dark:text-slate-200">
                            {lastAIResponse || "Thinking..."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <textarea
                                rows={4}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    isListening
                                        ? "Listening..."
                                        : "Response area"
                                }
                                className="w-full p-4 rounded-2xl border-2 border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-purple-500 outline-none transition-all resize-none shadow-inner"
                            />
                            {isListening && (
                                <div className="absolute top-4 right-4 flex gap-1 items-center">
                                    <span className="text-[10px] text-red-500 font-bold mr-2">
                                        LIVE MIC
                                    </span>
                                    <div className="h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <p className="text-[10px] text-slate-400 font-mono">
                                {isListening
                                    ? "AUTO-SUBMIT ENABLED (4s)"
                                    : "PROCESSING..."}
                            </p>
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-xl transition-all disabled:bg-slate-300"
                                onClick={handleSend}
                                disabled={sending || !input.trim()}>
                                {sending ? "Analyzing..." : "Manual Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
