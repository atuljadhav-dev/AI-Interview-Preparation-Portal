"use client";

import RatingAnalytics from "@/components/RatingAnalytics";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/dashboard/stats");
                setStats(res.data.data);
                toast.success("Dashboard stats fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    return (
        <div
            className="min-h-screen p-4 sm:p-6 bg-gradient-to-br 
    from-purple-100 via-blue-100 to-pink-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                 Dashboard 
            </h1>

            {loading ? (
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Average Feedback Rating
                            </h2>
                            <p className=" text-xl text-gray-800 dark:text-white">
                                {stats.avgFeedbackRating}
                            </p>
                        </div>

                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Scheduled Interviews
                            </h2>
                            <p className=" text-xl text-gray-800 dark:text-white">
                                {stats.scheduledInterviews}
                            </p>
                        </div>

                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Total ATS Reports
                            </h2>
                            <p className=" text-xl text-gray-800 dark:text-white">
                                {stats.totalATSReports}
                            </p>
                        </div>

                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Total Feedbacks
                            </h2>
                            <p className=" text-xl text-gray-800 dark:text-white">
                                {stats.totalFeedbacks}
                            </p>
                        </div>

                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Total Interviews
                            </h2>
                            <p className=" text-xl text-gray-800 dark:text-white">
                                {stats.totalInterviews}
                            </p>
                        </div>

                        <div
                            className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Total Resumes
                            </h2>
                            <p className="text-xl text-gray-800 dark:text-white">
                                {stats.totalResumes}
                            </p>
                        </div>

                        <div
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg 
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700 
hover:scale-[1.02] hover:shadow-xl transition duration-300">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Skills Rating
                            </h2>

                            <div className="space-y-4">
                                {Object.entries(stats.skillsRating).map(
                                    ([skill, rating]) => (
                                        <div key={skill}>
                                            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                                                <span>{skill}</span>
                                                <span>{rating}</span>
                                            </div>

                                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                                                <div
                                                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                                    style={{
                                                        width: `${
                                                            rating * 20
                                                        }%`,
                                                    }}></div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
p-6 rounded-2xl shadow-lg border border-purple-500 dark:border-gray-700
hover:scale-[1.02] hover:shadow-xl transition duration-300 flex flex-col ">
                            <h2 className=" text-xl text-gray-800 dark:text-white">
                                Feedback Rating Trend
                            </h2>
                            <p className="text-gray-600 grow dark:text-gray-300 mt-2">
                                <RatingAnalytics ratings={stats.ratings} />
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
