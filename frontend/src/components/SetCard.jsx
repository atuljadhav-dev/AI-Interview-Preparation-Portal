"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React from "react";

const SetCard = ({ set, index }) => {
    const router = useRouter();

    const startTest = async () => {
        try {
            const { data } = await api.post("/aptitude/set", { set });
            router.push(`/aptitude/${data.data._id}`);
        } catch (e) {
            console.error("Failed to start test:", e);
        }
    };

    // Semantic color mapping for both modes
    const categoryStyles = {
        numerical:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
        reasoning:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
        verbal: "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
        advanced:
            "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    };

    return (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-gray-800 rounded-xl p-5 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-purple-500/10 transition-all duration-300">
            {/* Top Bar */}
            <div className="flex justify-end items-center mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                    30 min
                </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">
                Latest PYQ
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
                Aptitude Practice Set
            </p>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(set.category).map((key) => (
                    <span
                        key={key}
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                            categoryStyles[key] ||
                            "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                        {key}: {set.category[key]}
                    </span>
                ))}
            </div>

            {/* Button */}
            <button
                onClick={startTest}
                className="w-full cursor-pointer py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]">
                Start Test →
            </button>
        </div>
    );
};

export default SetCard;
