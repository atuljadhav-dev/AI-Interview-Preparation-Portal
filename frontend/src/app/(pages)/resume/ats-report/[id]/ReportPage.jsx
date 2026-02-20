"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReportPage = ({ id }) => {
    const [report, setReport] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/ats/report/${id}`,
                    {
                        withCredentials: true,
                    }
                );
                setReport(data?.data);
                console.log(data?.data);
                toast.success("Report fetched successfully.");
            } catch (e) {
                toast.error("Failed to fetch report.");
            }
        };
        fetchReport();
    }, [id]);
    return (
        <div>
            {report ? (
                <div>
                    <h1>ATS Report</h1>
                    <p>Final Score: {report.atsReport.finalScore}</p>
                    <h2>Alignment</h2>
                    <p>
                        Coverage Percentage:{" "}
                        {report.atsReport.alignment.coveragePercentage}%
                    </p>
                    <p>
                        Matched Skills:{" "}
                        {report.atsReport.alignment.matchedSkills.join(", ")}
                    </p>
                    <p>
                        Missing Skills:{" "}
                        {report.atsReport.alignment.missingSkills.join(", ") ||
                            "None"}
                    </p>
                    <h2>Grammar Suggestions</h2>
                    <ul>
                        {report.atsReport.grammarSuggestions.map(
                            (suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            )
                        )}
                    </ul>
                    <h2>Impact Signals</h2>
                    <p>
                        Action Verb Count:{" "}
                        {report.atsReport.impactSignals.actionVerbCount}
                    </p>
                    <p>
                        Metrics Detected:{" "}
                        {report.atsReport.impactSignals.metricsDetected
                            ? "Yes"
                            : "No"}
                    </p>
                    <h2>Length Optimization</h2>
                    <p>
                        Word Count:{" "}
                        {report.atsReport.lengthOptimization.wordCount}
                    </p>
                    <h2>Presence</h2>
                    <p>
                        Contact Details:{" "}
                        {report.atsReport.presence.contactDetails.email
                            ? "Email "
                            : ""}
                        {report.atsReport.presence.contactDetails.github
                            ? "GitHub "
                            : ""}
                        {report.atsReport.presence.contactDetails.linkedin
                            ? "LinkedIn"
                            : ""}
                    </p>
                    <h2>Structure</h2>
                    <p>
                        Sections Found:{" "}
                        {report.atsReport.structure.sectionsFound.join(", ")}
                    </p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            {report && (
                <>
                    <button
                        onClick={() => {
                            router.push(
                                `/resume/generate?atsId=${report?._id}`
                            );
                        }}>
                        Fix Resume
                    </button>
                </>
            )}
        </div>
    );
};

export default ReportPage;
