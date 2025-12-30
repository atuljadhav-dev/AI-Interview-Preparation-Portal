"use client";

import FeedBackCard from "@/components/FeedBackCard";
import axios from "axios";
import { useEffect } from "react";
export const metadata={
    title: "Feedback - PlacementReady",
    description:
        "Detailed feedback on your interview performance. Review insights and suggestions to improve your skills and ace future interviews with PlacementReady.",
}
const page = () => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback`,
                    { withCredentials: true }
                );
            } catch (e) {
                toast.error("Failed to fetch feedback data");
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <FeedBackCard />
        </div>
    );
};

export default page;
