"use client";
import ATSCard from "@/components/ATSCard";
import { useUser } from "@/hooks/useUser";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React, {  useEffect, useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [reports, setReports] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const { resumes } = useUser();
    const [jobs, setJobs] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await api.get(
                    `/ats/reports?page=${page}&limit=${limit}`
                );
                setReports(data?.data.reports);
                setTotalPages(data?.data.totalPages);
            } catch (e) {
                toast.error("Failed to fetch reports.");
            }
        };
        fetchReports();
    }, []);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get(
                    "/jobs",
                    
                );
                setJobs(data?.data.jobs);
            } catch (e) {
                toast.error("Failed to fetch jobs.");
            }
        };
        fetchJobs();
    }, []);

    const handleSubmit = async () => {
        try {
            const { data } = await api.post(
                "/ats/generate",
                {
                    jobDescription,
                    resume: selectedResume,
                    title,
                    jobId,
                }
            );
            router.push(`/resume/ats-report/${data?.data?._id}`);
            toast.success("Resume analyzed successfully.");
        } catch (e) {
            toast.error("Failed to analyze resume.");
            console.error(e.response?.data || e.message);
        }
    };

    return (
  <div className="min-h-screen px-4 sm:px-6 py-8 
    bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

    <div className="max-w-5xl mx-auto">

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 ">
        ATS Report 
      </h1>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
        border border-purple-200 dark:border-gray-700 
        rounded-2xl p-6 shadow-lg space-y-5">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Job Description
          </label>
          <input
            type="text"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-300 
            focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Job
            </label>
            <select
              value={jobId || ""}
              onChange={(e) => setJobId(e.target.value)}
              className="px-4 py-2 rounded-lg border border-purple-300 
              focus:ring-2 focus:ring-purple-400 outline-none dark:text-white"
            >
              <option value="" className="text-black bg-white dark:text-white dark:bg-black">Select Job</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}className="text-black bg-white dark:text-white dark:bg-black">
                  {job.title} 
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-gray-600">No Jobs Found</div>
        )}

        {resumes && resumes.length > 0 ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Resume
            </label>
            <select
              value={selectedResume ? selectedResume._id : ""}
              onChange={(e) => {
                const res = resumes.find(
                  (cur) => cur._id === e.target.value
                );
                setSelectedResume(res);
              }}
              className="px-4 py-2 rounded-lg border border-purple-300 
              focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="" className="text-black bg-white dark:text-white dark:bg-black">Select Resume</option>
              {resumes.map((res) => (
                <option key={res._id} value={res._id}className="text-black bg-white dark:text-white dark:bg-black">
                  {res.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-gray-600">No Resumes Found</div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-semibold
          bg-gradient-to-r from-purple-600 to-blue-600 text-white 
          hover:scale-[1.02] hover:shadow-lg transition duration-300"
        >
          Generate Report 
        </button>
      </div>

      {reports && reports.length > 0 ? (
        <div className="mt-10 space-y-6">

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Previous Reports
          </h2>

          <div className="grid gap-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="transform transition hover:scale-[1.02] hover:shadow-xl p-4 m-2 border border-gray-600 rounded-lg"
              >
                <ATSCard data={report} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">

              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-full border border-purple-300 
                bg-white dark:bg-gray-800 
                hover:bg-purple-500 hover:text-white 
                transition disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-full border border-purple-300 
                bg-white dark:bg-gray-800 
                hover:bg-purple-500 hover:text-white 
                transition disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-8 text-gray-600 dark:text-gray-300">
          No Previous Reports
        </div>
      )}

    </div>
  </div>
);
};

export default ResumePage;
