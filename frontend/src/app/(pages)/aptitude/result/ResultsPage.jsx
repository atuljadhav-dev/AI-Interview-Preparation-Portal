"use client";
import ResultCard from "@/components/ResultCard";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ResultsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const limit = 9;

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(
                `/aptitude/result?page=${page}&limit=${limit}`
            );
            // Accessing results based on your typical Flask API response structure
            setData(data.data.results || []);
            setTotalPages(data.data.totalPages || 1);
            setTotalResults(data.data.totalResults || 0);
        } catch (e) {
            console.error("Fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    // Re-run whenever the page changes
    useEffect(() => {
        fetchData();
        // Scroll to top when page changes for better UX
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Aptitude Test Results
                </h1>
                <p className="text-slate-500 dark:text-zinc-400">
                    Showing {totalResults} total assessments
                </p>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-slate-100 dark:bg-zinc-900 rounded-2xl"
                        />
                    ))}
                </div>
            ) : data && data.length > 0 ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((result) => (
                            <ResultCard key={result._id} result={result} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-4 py-6 border-t dark:border-zinc-800">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
                            className="flex cursor-pointer items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 transition">
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                                Page{" "}
                                <span className="text-slate-900 dark:text-white">
                                    {page}
                                </span>{" "}
                                of {totalPages}
                            </span>
                        </div>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="flex cursor-pointer items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-zinc-800 transition">
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                        No results yet
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Take your first aptitude test to track your progress.
                    </p>
                    <a
                        href="/aptitude"
                        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition">
                        Start Now
                    </a>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
