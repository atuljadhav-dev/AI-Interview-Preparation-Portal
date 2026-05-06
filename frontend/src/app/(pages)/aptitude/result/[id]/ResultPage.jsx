"use client";
import Question from "@/components/Question";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

const ResultPage = ({ id }) => {
    
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [category, setCategory] = useState(null);
    const fetchData = async () => {
        try {
            const { data } = await api.get(`/aptitude/result?id=${id}`);
            console.log("Fetched result data:", data);
            setQuestions(data.data.questions);
            setUserAnswers(data.data.userAnswers);
            setCategory(data.data.category);
            setScore(data.data.score);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white flex flex-col">
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] flex items-center justify-between px-6 sticky top-0 z-10">
                <h1 className="font-bold text-lg">Your Score: {score}/30</h1>
            </header>
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-lg mt-6 mx-6">
                <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
                    SET 1: Latest PYQ
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                    Aptitude Practice Set
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(category || {}).map((key) => (
                        <span
                            key={key}
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                                {
                                    numerical:
                                        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                                    reasoning:
                                        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
                                    verbal: "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
                                    advanced:
                                        "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
                                }[key] ||
                                "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            }`}>
                            {key}: {category[key]}
                        </span>
                    ))}
                </div>
            </div>
            <main className="flex-1 py-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="mb-8">
                        <Question
                            question={q}
                            idx={idx}
                            userAnswers={userAnswers}
                            isResult={true}
                        />
                    </div>
                ))}
            </main>
        </div>
    );
};

export default ResultPage;
