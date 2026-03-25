"use client";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReportPage = ({ id }) => {
    const [report, setReport] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await api.get(
                    `/ats/report/${id}`,
                    
                );
                setReport(data?.data);
                toast.success("Report fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch report.");
            }
        };
        fetchReport();
    }, [id]);
   return (
  <div className="min-h-screen px-4 sm:px-6 py-8 
    bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

    {report ? (
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white">
          ATS Report
        </h1>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
          border border-purple-200 dark:border-gray-700 
          rounded-2xl p-6 text-center shadow-lg">

          <p className="text-black dark:text-white mb-2 text-2xl font-bold">
            Final Score
          </p>

          <p className="text-4xl font-bold text-purple-600">
            {report.atsReport.finalScore}
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Alignment */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5 space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Alignment</h2>
            <p>
              Coverage:{" "}
              <span className="font-semibold text-purple-500">
                {report.atsReport.alignment.coveragePercentage}%
              </span>
            </p>
            <p>
              Matched Skills:{" "}
              {report.atsReport.alignment.matchedSkills.join(", ")}
            </p>
            <p>
              Missing Skills:{" "}
              {report.atsReport.alignment.missingSkills.join(", ") || "None"}
            </p>
          </div>

          {/* Impact */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Impact Signals</h2>
            <p>
              Action Verbs:{" "}
              {report.atsReport.impactSignals.actionVerbCount}
            </p>
            <p>
              Metrics Detected:{" "}
              {report.atsReport.impactSignals.metricsDetected ? "Yes" : "No"}
            </p>
          </div>

          {/* Grammar */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 col-span-1 md:col-span-2">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Grammar Suggestions</h2>
            <ul className="list-disc ml-5 space-y-1">
              {report.atsReport.grammarSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Length */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Length Optimization</h2>
            <p>
              Word Count:{" "}
              {report.atsReport.lengthOptimization.wordCount}
            </p>
          </div>

          {/* Presence */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Presence</h2>
            <p>
              {report.atsReport.presence.contactDetails.email && "Email "}
              {report.atsReport.presence.contactDetails.github && "GitHub "}
              {report.atsReport.presence.contactDetails.linkedin && "LinkedIn"}
            </p>
          </div>

          {/* Structure */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 col-span-1 md:col-span-2">
            <h2 className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
  border border-purple-200 dark:border-gray-700 
  rounded-xl p-5  space-y-2 
   hover:scale-[1.02] transition duration-300 font-bold">Structure</h2>
            <p>
              {report.atsReport.structure.sectionsFound.join(", ")}
            </p>
          </div>

        </div>

        {/* Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              router.push(`/resume/generate?atsId=${report?._id}`);
            }}
            className="px-6 py-3 rounded-lg text-white font-semibold 
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:scale-105 hover:shadow-lg transition duration-300"
          >
            Fix Resume
          </button>
        </div>

      </div>
    ) : (
      <p className="text-center text-gray-600 dark:text-w">
        Loading...
      </p>
    )}
  </div>
);
};

export default ReportPage;
