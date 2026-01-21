"use client";
import { useRouter } from "next/navigation";

const InterviewCard = ({ interview }) => {
    const router = useRouter();

    const {
        _id,
        title,
        roundName,
        status,
        jobDescription,
        questions,
        feedbackId,
        skills,
    } = interview;
    return (
        <div className=" border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-purple-600 transition">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 capitalize">
                    {title}
                </h2>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        status === "Done"
                            ? "dark:bg-green-600/20 dark:text-green-400 text-green-700 bg-green-100"
                            : "dark:bg-yellow-600/20 dark:text-yellow-400 text-yellow-700 bg-yellow-100"
                    }`}>
                    {status}
                </span>
            </div>
            <div className="flex justify-between gap-1 flex-wrap">
                {skills &&
                    skills.map((cur, idx) => {
                        return (
                            <div
                                className="px-3 py-1 rounded-full text-sm font-semibold dark:bg-green-600/20 dark:text-green-400 text-green-700 bg-green-100"
                                key={idx}>
                                {cur}
                            </div>
                        );
                    })}
            </div>
            {/* Meta */}
            <p className=" text-sm mb-1">
                <span className="font-semibold text-indigo-800 dark:text-indigo-300">
                    Round:
                </span>{" "}
                {roundName}
            </p>

            <p className=" text-sm mb-3">
                <span className="font-semibold text-indigo-800 dark:text-indigo-300">
                    Questions:
                </span>{" "}
                {questions?.length || 0}
            </p>

            {/* Description */}
            <p className="text-sm line-clamp-3 mb-4">{jobDescription}</p>

            {/* Action */}
            <div className="flex justify-end">
                {status === "Done" && feedbackId ? (
                    <button
                        onClick={() => router.push(`/feedback/${_id}`)}
                        className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-5 py-2 rounded-lg text-white font-semibold transition">
                        View Feedback
                    </button>
                ) : (
                    <button
                        onClick={() => router.push(`/interview/${_id}`)}
                        className="bg-purple-600 cursor-pointer hover:bg-purple-700 px-5 py-2 rounded-lg text-white font-semibold transition">
                        Start Interview
                    </button>
                )}
            </div>
        </div>
    );
};

export default InterviewCard;
