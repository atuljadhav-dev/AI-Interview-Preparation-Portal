"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [report, setReport] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const { resume } = useUser();
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/ai/ats-report`,
                {
                    jobDescription,
                    resume: selectedResume,
                },
                {
                    withCredentials: true,
                }
            );
            setReport(data?.data);
        } catch (e) {
            toast.error("Failed to analyze resume.");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={jobDescription}
                onChange={(e) => {
                    setJobDescription(e.target.value);
                }}
            />
            {resume && resume.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resume.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res.resume);
                    }}>
                    <option value="">Select Resume</option>
                    {resume.map((res) => (
                        <option key={res._id} value={res._id}>
                            {res.name}
                        </option>
                    ))}
                </select>
            ) : (
                <div>No Resumes Found</div>
            )}
            <button onClick={handleSubmit}>submit</button>
            {report && (
                <div>
                    <div>
                        <h1>ATS Analysis Report</h1>
                        <div>
                            <h2>ATS Score: {report.atsScore}</h2>
                            <div>
                                <div>Interview Outlook:</div>{" "}
                                {report.recommendation.interviewRecommendation}
                            </div>
                            <div>
                                <div>Resume Feedback:</div>{" "}
                                {report.recommendation.resumeRecommendation}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Executive Summary</h3>
                        <div>{report.summary}</div>
                    </div>

                    <div>
                        <h3>Skills Analysis</h3>

                        <div>
                            <h4>Hard Skills Matched</h4>
                            <ul>
                                {report.skillsAnalysis.hardSkillsMatched.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Missing Skills (Gap Analysis)</h4>
                            <ul>
                                {report.skillsAnalysis.hardSkillsMissing.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Soft Skills Detected</h4>
                            <ul>
                                {report.skillsAnalysis.softSkillsFound.map(
                                    (skill, index) => (
                                        <li key={index}>{skill}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3>Searchability Check</h3>
                        <ul>
                            <li>
                                Email:{" "}
                                {report.searchability.emailPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Phone:{" "}
                                {report.searchability.phonePresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                LinkedIn:{" "}
                                {report.searchability.linkedinPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Location:{" "}
                                {report.searchability.locationPresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                            <li>
                                Job Title Match:{" "}
                                {report.searchability.jobTitleMatch
                                    ? "Yes"
                                    : "No"}
                            </li>
                            <li>
                                Name:{" "}
                                {report.searchability.namePresent
                                    ? "Detected"
                                    : "Missing"}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3>Grammar & Formatting</h3>

                        <div>
                            <h4>Grammar Issues</h4>
                            <div>
                                Grammar Errors Found:{" "}
                                {report.grammerCheck.grammarIssuesFound
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <div>
                                Spelling Errors Found:{" "}
                                {report.grammerCheck.spellingErrorsFound
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <ul>
                                {report.grammerCheck.correctionsSuggested.map(
                                    (correction, index) => (
                                        <li key={index}>{correction}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div>
                            <h4>Formatting Feedback</h4>
                            <dl>
                                <dt>
                                    <div>Voice Usage:</div>
                                </dt>
                                <dd>
                                    {report.formattingCheck.usageOfActiveVoice}
                                </dd>

                                <dt>
                                    <div>Repetition Check:</div>
                                </dt>
                                <dd>
                                    {report.formattingCheck.repetitionCheck}
                                </dd>

                                <dt>
                                    <div>Casing Errors:</div>
                                </dt>
                                <dd>
                                    <ul>
                                        {report.formattingCheck.skillCasingErrors.map(
                                            (error, index) => (
                                                <li key={index}>{error}</li>
                                            )
                                        )}
                                    </ul>
                                </dd>
                            </dl>
                        </div>
                    </div>

                    <div>
                        <h3>Recruiter's Action Plan</h3>
                        <div>
                            <div>Measurable Results Found:</div>{" "}
                            {report.recruiterTips.measurableResultsFound
                                ? "Yes"
                                : "No - Needs Improvement"}
                        </div>

                        <h4>Improvement Suggestions</h4>
                        <ol>
                            {report.recruiterTips.improvementSuggestions.map(
                                (suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                )
                            )}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumePage;
