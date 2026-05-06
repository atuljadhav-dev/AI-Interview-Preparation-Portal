"use client";
import Question from "@/components/Question";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAssessmentMonitor } from "@/hooks/useAssessmentMonitor";
import { toast } from "react-toastify";

const TestPage = ({ id }) => {
    const [questions, setQuestions] = useState([]);
    const [category, setCategory] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [currentIdx, setCurrentIdx] = useState(0); // For pagination logic
    const router = useRouter();
    const [testStart, setTestStart] = useState(false);
    const { isFullScreen, isTabActive, warningCount, toggleFullScreen } =
        useAssessmentMonitor();
    const fetchData = async () => {
        try {
            const { data } = await api.get(`/aptitude/set?id=${id}`);
            setQuestions(data.data.questions);
            const initialAnswers = {};
            data.data.questions.forEach((q) => {
                initialAnswers[q.id] = "";
            });
            setUserAnswers(initialAnswers);
            setCategory(data.data.category);
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!testStart) {
            return;
        }
        toast.warn(`! Do not switch the tab`);
    }, [warningCount]);
    useEffect(() => {
        fetchData();
    }, []);
    let timeLeft = 60 * 30;
    let timerId = null;
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    function startTimer() {
        // Check if timer is already running to avoid speed-up bugs
        if (timerId !== null) return;

        console.log("Timer started...");

        timerId = setInterval(() => {
            timeLeft--;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                alert("Time is up!");
            }
            setMinutes(Math.floor(timeLeft / 60));
            setSeconds(timeLeft % 60);
        }, 1000);
    }

    const submitAnswers = async () => {
        try {
            const { data } = await api.post(`/aptitude/result`, {
                userAnswers,
                setId: id,
            });
            console.log("Submitted answers, got result:", data);
            toggleFullScreen(); // Exit full-screen mode after submission
            router.push(`/aptitude/result/${data.data._id}`);
        } catch (e) {
            console.error(e);
        }
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen  flex items-center justify-center text-white">
                <div className="animate-pulse">Loading questions...</div>
            </div>
        );
    }
    if (questions.length != 0 && !isFullScreen) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center 
  px-4 
  bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 
  dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Aptitude Test Instructions
                </h1>

                {/* Instructions Card */}
                <div
                    className="
    border-2 border-gray-700 dark:border-purple-500 rounded-2xl  p-4 max-w-xl w-full mb-8
    bg-white dark:bg-black transition">
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        <li>
                            ✅ Read each question carefully before answering.
                        </li>

                        <li>
                            ⏱️ The test is time-bound. Manage your time wisely.
                        </li>

                        <li>
                            🚫 Do not refresh or leave the page during the test.
                        </li>

                        <li>🎯 Each question has only one correct answer.</li>

                        <li>
                            📊 Your score will be shown at the end of the test.
                        </li>

                        <li>
                            💡 Try to attempt all questions for better
                            evaluation.
                        </li>
                    </ul>
                </div>

                {/* Start Button */}
                <button
                    className="inline-block 
    bg-gradient-to-r from-purple-600 to-blue-600 
    text-white font-bold text-lg px-8 py-4 
    rounded-full shadow-lg 
    hover:scale-105 hover:shadow-xl 
    transition duration-300"
                    onClick={() => {
                        setTestStart(true);
                        toggleFullScreen();
                        startTimer();
                    }}>
                    Start Test
                </button>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col">
            {/* TOP BAR */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] flex items-center justify-between px-6 sticky top-0 z-10">
                <div>
                    <h1 className="font-bold text-lg">SET 1: Latest PYQ</h1>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                        Q{currentIdx + 1} of {questions.length}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 font-mono">
                        <Clock size={18} />
                        <span>
                            {minutes}:{seconds}
                        </span>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                        {
                            Object.values(userAnswers).filter((a) => a !== "")
                                .length
                        }
                        /{questions.length}
                    </div>
                    <div>{warningCount}</div>
                    <button onClick={toggleFullScreen}>Exit</button>
                    <button
                        onClick={submitAnswers}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition">
                        Submit <CheckCircle size={18} />
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col lg:flex-row p-4 gap-6 max-w-[1600px] mx-auto w-full">
                {/* LEFT: Question Section */}
                <div className="flex-1 space-y-4">
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {category &&
                            Object.keys(category).map((key) => (
                                <button
                                    key={key}
                                    className="px-4 py-1.5 rounded-md text-sm font-medium border border-blue-500/20 bg-blue-500/10 text-blue-400 whitespace-nowrap">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                                    ({category[key]})
                                </button>
                            ))}
                    </div>

                    {/* Question Card */}
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <div className="mb-6">
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                Section : {questions[currentIdx].category} Ability
                            </span>
                        </div>

                        <Question
                            question={questions[currentIdx]}
                            idx={currentIdx}
                            setUserAnswers={setUserAnswers}
                            userAnswers={userAnswers}
                        />

                        {/* Pagination Buttons */}
                        <div className="flex justify-between mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => {
                                    setCurrentIdx((prev) =>
                                        Math.max(0, prev - 1)
                                    );
                                }}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition">
                                <ChevronLeft size={20} /> Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentIdx((prev) =>
                                        Math.min(questions.length - 1, prev + 1)
                                    )
                                }
                                disabled={currentIdx === questions.length - 1}
                                className="flex items-center gap-2 px-8 py-2 rounded-lg disabled:opacity-30 bg-slate-800 dark:bg-slate-700 text-white hover:opacity-90 transition">
                                Next <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Sidebar Navigator */}
                <aside className="w-full lg:w-80 space-y-4">
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24">
                        <h3 className="font-bold mb-4 flex items-center justify-between">
                            Question Navigator
                        </h3>

                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isAnswered = userAnswers[q.id] !== "";
                                const isCurrent = currentIdx === idx;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIdx(idx)}
                                        className={`h-10 w-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center border
                                            ${
                                                isCurrent
                                                    ? "bg-blue-600 text-white border-blue-600 scale-110 shadow-lg"
                                                    : isAnswered
                                                    ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent hover:border-slate-300"
                                            }
                                        `}>
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="w-3 h-3 rounded-sm bg-purple-600"></span>{" "}
                                Current
                            </div>
                            <div className="flex items-center gap-3 text-xs text-purple-500">
                                <span className="w-3 h-3 rounded-sm bg-purple-500/20 border border-purple-500/40"></span>{" "}
                                Answered
                            </div>
                            <div className="flex items-center gap-3 text-xs text-purple-500">
                                <span className="w-3 h-3 rounded-sm bg-purple-100 dark:bg-purple-800"></span>{" "}
                                Not Answered
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default TestPage;
