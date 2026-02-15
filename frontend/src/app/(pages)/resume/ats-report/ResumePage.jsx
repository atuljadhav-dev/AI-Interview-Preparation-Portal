"use client";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResumePage = () => {
    const [report, setReport] = useState({
        atsScore: 74,
        formattingCheck: {
            repetitionCheck:
                "No significant repetition of phrases or concepts was detected in the primary sections.",
            skillCasingErrors: [],
            usageOfActiveVoice:
                "The summary contains first-person phrasing ('I am') which can be revised for a more professional, action-oriented tone. Experience descriptions generally use active voice.",
        },
        grammerCheck: {
            correctionsSuggested: [
                "Avoid first-person 'I am'. Use action-oriented verbs like 'Developed' or 'Built' in the summary and objective statements.",
            ],
            grammarIssuesFound: true,
            spellingErrorsFound: false,
        },
        projectsAnalysis: {
            feedback:
                "The projects are highly relevant to MERN stack development, showcasing practical application of key technologies like MongoDB, Flask (backend logic), Next.js (React framework), and API integrations. The diversity and complexity of projects ('PlacementReady- AI interview Portal', 'FitBuddy', 'GitHubExplain') demonstrate robust full-stack capabilities and problem-solving skills.",
            projectQualityScore: 9,
            relevantProjectsFound: true,
        },
        recommendation: {
            interviewRecommendation:
                "Given the strong technical skill match (all hard skills found) and impressive project portfolio, this candidate is recommended for an interview to further assess their practical experience and cultural fit.",
            resumeRecommendation:
                "The resume is strong but would benefit from refining the summary, incorporating quantifiable achievements, and explicitly targeting the 'MERN Developer' role to maximize ATS ranking and recruiter appeal.",
        },
        recruiterTips: {
            improvementSuggestions: [
                "Quantify achievements in experience and project descriptions wherever possible (e.g., 'Developed X feature, resulting in Y improvement').",
                "Tailor the resume summary to explicitly mention 'MERN Developer' or related full-stack roles to align more closely with job descriptions.",
                "Rephrase the resume summary to eliminate first-person pronouns and start with strong action verbs, aligning with professional resume best practices.",
            ],
            measurableResultsFound: false,
        },
        searchability: {
            emailPresent: true,
            jobTitleMatch: false,
            linkedinPresent: true,
            locationPresent: true,
            namePresent: true,
            phonePresent: true,
        },
        skillsAnalysis: {
            hardSkillsMatched: [
                "react",
                "css",
                "mongodb",
                "javascript",
                "restapi",
                "expressjs",
                "nodejs",
            ],
            hardSkillsMissing: [],
            missingCertifications: [
                "Consider certifications in specific MERN stack technologies (e.g., MongoDB, React, Node.js) or full-stack web development to further demonstrate expertise.",
            ],
            softSkillsFound: [
                "results-driven",
                "quickly learning new concepts",
                "collaborating within teams",
                "commitment to delivering high-quality solutions",
                "tackle complex challenges effectively",
            ],
        },
        summary:
            "The resume demonstrates a strong foundational match for MERN Developer roles, achieving an ATS score of 74. Key MERN stack technologies are prominently featured and matched, indicating a solid technical background. However, specific areas for optimization, such as resume summary phrasing and quantifiable achievements, are noted to further enhance candidate appeal.",
    });
    const [jobDescription, setJobDescription] =
        useState(`A MERN Developer specializes in building full-stack web applications using a unified JavaScript ecosystem. The term is an acronym for the four core technologies used: MongoDB, Express.js, React.js, and Node.js.

Core Stack Components
The MERN stack is designed to handle the entire development lifecycle, from the user interface to the database.

MongoDB (Database): A NoSQL, document-oriented database that stores data in flexible, JSON-like formats (BSON).

Express.js (Backend Framework): A minimalist web framework for Node.js used to build robust server-side logic and RESTful APIs.

React.js (Frontend Library): A library developed by Meta for building dynamic, component-based user interfaces with an efficient Virtual DOM for fast rendering.

Node.js (Runtime Environment): A JavaScript runtime that allows code to run on the server side, utilizing an event-driven, non-blocking I/O model for high performance.

Key Responsibilities
A MERN developer manages both client-side and server-side development.

Frontend Development: Building responsive and interactive user interfaces using React components, state management (e.g., Redux or Context API), and modern CSS.

Backend Development: Creating scalable server-side applications and managing API endpoints with Node.js and Express.

Database Management: Designing schemas, handling data storage, and optimizing queries in MongoDB.

API Integration: Connecting the frontend to the backend via RESTful services or GraphQL, often using tools like Axios or the Fetch API.

Maintenance and Testing: Debugging, writing unit tests (using Jest or Mocha), and optimizing performance across the entire stack.`);
    const [selectedResume, setSelectedResume] = useState(null);
    const router = useRouter();
    const { resumes } = useUser();
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
            {resumes && resumes.length > 0 ? (
                <select
                    value={selectedResume ? selectedResume._id : ""}
                    onChange={(e) => {
                        const res = resumes.find(
                            (cur) => cur._id === e.target.value
                        );
                        setSelectedResume(res);
                    }}>
                    <option value="">Select Resume</option>
                    {resumes.map((res) => (
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
                <>
                    <button
                        onClick={() => {
                            const data = encodeURIComponent(
                                JSON.stringify({
                                    jobDescription,
                                    resume: selectedResume._id,
                                    atsReport: report,
                                })
                            );
                            router.push(`/resume/generate?data=${data}`);
                        }}>
                        Fix Resume
                    </button>
                </>
            )}
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
