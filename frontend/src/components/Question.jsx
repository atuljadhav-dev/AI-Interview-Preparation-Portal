"use client";
import React from "react";

const Question = ({
    question,
    setUserAnswers,
    userAnswers,
    isResult = false,
    idx = 1,
}) => {
    const {
        question: questionText,
        options,
        answer = null,
        explanation = null,

    } = question;

    const selectedOption = userAnswers[question.id];

    return (
        /* Added max-w-3xl and mx-auto to keep it centered and small */
        /* overflow-hidden ensures nothing bleeds out */
        <div className="w-full max-w-3xl mx-auto overflow-hidden">
            {/* Question Text - Reduced size and margin for better fit */}
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 leading-snug break-words">
                <span className="">{idx+1}.</span> {questionText}
            </h2>

            {/* Options List - Using a gap that scales down on small screens */}
            <div className="grid grid-cols-1 gap-3">
                {options.map((option, idx) => {
                    const isSelected = selectedOption === option;

                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                if (isResult) return; // Disable changes on result page
                                setUserAnswers((prev) => ({
                                    ...prev,
                                    [question.id]: option,
                                }));
                            }}
                            /* Reduced padding (p-3) to save vertical space */
                            className={`group flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-left w-full
                                ${
                                    !isResult && isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" // Selection state before submitting
                                        : isResult && option === answer
                                        ? "border-green-500 bg-green-50 dark:bg-green-500/10" // Correct answer (always green)
                                        : isResult &&
                                          isSelected &&
                                          option !== answer
                                        ? "border-red-500 bg-red-50 dark:bg-red-500/10" // Wrong answer selected by user
                                        : "border-slate-300 dark:border-slate-600 hover:border-slate-400" // Default state
                                }`}>
                            {/* Radio Circle - Slightly smaller (w-5 h-5) */}
                            <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors
                                ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                                }`}>
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>

                            {/* Option Text - Added break-words to handle long strings */}
                            <span
                                className={`text-sm md:text-base font-medium break-words
                                ${
                                    isSelected
                                        ? "text-blue-700 dark:text-blue-400"
                                        : "text-slate-600 dark:text-slate-400"
                                }`}>
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Explanation - Only show if it's the result page and explanation exists */}
            {isResult && explanation && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 dark:border-yellow-600 rounded">
                    <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                        Explanation
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 break-words">
                        {explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Question;
