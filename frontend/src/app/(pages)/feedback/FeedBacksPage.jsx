"use client";

import FeedBackCard from "@/components/FeedBackCard";
import api from "@/utils/api";
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
                const res = await api.get(`/feedback?page=${page}&limit=${limit}`);
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
  <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br 
    from-purple-100 via-blue-100 to-pink-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition">

    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Feedbacks
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      ) : feedbacks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {feedbacks.map((feedback) => (
              <div
                key={feedback._id}
              >
                <FeedBackCard data={feedback} />
              </div>
            ))}

          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-3">

              <button
                onClick={() =>
                  setPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={page === 1}
                className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-300 
                hover:bg-purple-500 hover:text-white 
                hover:scale-105 transition duration-300 
                disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {/* Page Info */}
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
                Page {page} of {totalPages}
              </span>

              {/* Next */}
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={page === totalPages}
                className="px-5 py-2 rounded-full bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-300 
                hover:bg-purple-500 hover:text-white 
                hover:scale-105 transition duration-300 
                disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>

            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No feedbacks found.
        </p>
      )}
    </div>
  </div>
);
};

export default FeedBacksPage;
