"use client";

import FeedBackCard from "@/components/FeedBackCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FeedBacksPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/feedback?page=${page}&limit=${limit}`,
                    { withCredentials: true }
                );
                setFeedbacks(res.data.data.feedbacks);
                setTotalPages(res.data.data.totalPages);
                toast.success("Feedbacks fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch feedbacks.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [page]);
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : feedbacks.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {feedbacks.map((feedback) => (
                            <FeedBackCard data={feedback} key={feedback._id} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() =>
                                    setPage((prev) => Math.max(prev - 1, 1))
                                }
                                disabled={page === 1}
                                className="px-4 py-2 mx-1 rounded disabled:opacity-50 cursor-pointer text-gray-700 bg-gray-300 hover:bg-gray-400">
                                Previous
                            </button>
                            <span className="px-4 py-2 mx-1">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={page === totalPages}
                                className="px-4 py-2 mx-1 rounded disabled:opacity-50 cursor-pointer text-gray-700 bg-gray-300 hover:bg-gray-400">
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>No feedbacks found.</p>
            )}
        </div>
    );
};

export default FeedBacksPage;
