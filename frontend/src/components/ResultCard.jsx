import React from "react";
import { Calendar, CheckCircle2, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";

const ResultCard = ({ result }) => {
    const { score, category, dateTaken, questions, _id } = result;
    const { numerical, verbal, reasoning, advanced } = category;
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-5 sm:p-6">
                {/* Header: Date & Total Score */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center text-slate-500 dark:text-zinc-400 text-sm mb-1">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {new Date(dateTaken).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                            Aptitude Assessment
                        </h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <span
                            className={`text-2xl font-black ${
                                percentage >= 70
                                    ? "text-green-500"
                                    : "text-blue-500"
                            }`}>
                            {score}/{totalQuestions}
                        </span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Total Score
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: "Numerical",
                            value: numerical,
                            color: "text-orange-500",
                        },
                        {
                            label: "Verbal",
                            value: verbal,
                            color: "text-blue-500",
                        },
                        {
                            label: "Reasoning",
                            value: reasoning,
                            color: "text-purple-500",
                        },
                        {
                            label: "Advanced",
                            value: advanced,
                            color: "text-red-500",
                        },
                    ].map((cat) => (
                        <div
                            key={cat.label}
                            className="bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                                {cat.label}
                            </p>
                            <p className={`text-lg font-bold ${cat.color}`}>
                                {cat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center text-slate-600 dark:text-zinc-400 text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" />
                        <span>{percentage}% Accuracy</span>
                    </div>
                    <Link
                        href={`/aptitude/result/${_id}`}
                        className="flex items-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline group">
                        Review Answers
                        <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
