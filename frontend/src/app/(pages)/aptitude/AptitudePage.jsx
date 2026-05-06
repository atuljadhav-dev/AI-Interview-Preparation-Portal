"use client";
import SetCard from "@/components/SetCard";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

const AptitudePage = () => {
    const [sets, setSets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/aptitude/sets`);
                setSets(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching sets:", error);
            }
        };
        fetchData();
    }, []);

    return (
        /* Updated: bg-slate-50 for light mode, bg-[#020617] for dark mode */
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white p-6 transition-colors duration-300">
            
            {/* Heading */}
            <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
                Mock Test Sets
            </h1>
            
            {/* Subtext: text-slate-600 for light, text-gray-400 for dark */}
            <p className="text-center text-slate-600 dark:text-gray-400 mb-8">
                Practice with latest aptitude test sets
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sets.map((set, index) => (
                    <SetCard key={set.id || index} set={set} index={index} />
                ))}
            </div>
        </div>
    );
};

export default AptitudePage;