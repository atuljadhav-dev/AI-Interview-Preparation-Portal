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
                toast.success("Dashboard stats fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return <div></div>;
};

export default DashboardPage;
