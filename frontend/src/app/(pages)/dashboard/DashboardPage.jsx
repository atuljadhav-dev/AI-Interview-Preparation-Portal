"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/stats`,
                    {
                        withCredentials: true,
                    }
                );
                setStats(res.data.data);
                console.log(res.data.data);
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
        <div>
            <h1>Dashboard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div>
                        <h2>Average Feedback Rating</h2>
                        <p>{stats.avgFeedbackRating}</p>
                    </div>
                    <div>
                        <h2>Scheduled Interviews</h2>
                        <p>{stats.scheduledInterviews}</p>
                    </div>
                    <div>
                        <h2>Skills Rating</h2>
                        {Object.entries(stats.skillsRating).map(
                            ([skill, rating]) => (
                                <p key={skill}>
                                    {skill}: <span>{rating}</span>
                                </p>
                            )
                        )}
                    </div>
                    <div>
                        <h2>Total ATS Reports</h2>
                        <p>{stats.totalATSReports}</p>
                    </div>
                    <div>
                        <h2>Total Feedbacks</h2>
                        <p>{stats.totalFeedbacks}</p>
                    </div>
                    <div>
                        <h2>Total Interviews</h2>
                        <p>{stats.totalInterviews}</p>
                    </div>
                    <div>
                        <h2>Total Resumes</h2>
                        <p>{stats.totalResumes}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
